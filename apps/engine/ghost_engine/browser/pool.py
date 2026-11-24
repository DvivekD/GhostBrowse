import asyncio
import logging
from typing import Optional, Dict, Any
import httpx
from ghost_engine.config import settings

logger = logging.getLogger(__name__)

class BrowserPoolManager:
    """
    Manages browser connections across Steel.dev Cloud stealth fleet and local Chromium.
    Dispenses isolated contexts and persistent sessions while guaranteeing minimal memory footprint.
    """
    def __init__(self, max_concurrent: int = 3):
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self._playwright = None
        self._browser = None
        self._active_contexts = 0
        self._lock = asyncio.Lock()
        self.is_steel_cloud = bool(settings.steel_api_key)

    async def create_persistent_steel_session(self) -> Optional[Dict[str, Any]]:
        """
        Spins up a dedicated persistent Steel.dev cloud session via Steel REST API.
        Returns metadata including {id, websocketUrl, sessionViewerUrl, debugUrl}.
        """
        if not settings.steel_api_key:
            return None
        try:
            url = "https://api.steel.dev/v1/sessions"
            headers = {
                "steel-api-key": settings.steel_api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "timeout": 300000,
                "isSelenium": False
            }
            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code in (200, 201):
                    data = resp.json()
                    logger.info(f"Created persistent Steel.dev session {data.get('id')}: viewer {data.get('sessionViewerUrl')}")
                    return {
                        "id": data.get("id"),
                        "websocketUrl": data.get("websocketUrl"),
                        "sessionViewerUrl": data.get("sessionViewerUrl"),
                        "debugUrl": data.get("debugUrl"),
                    }
                else:
                    logger.warning(f"Failed to create Steel session: HTTP {resp.status_code} {resp.text[:120]}")
        except Exception as e:
            logger.warning(f"Error creating persistent Steel session: {e}")
        return None

    async def connect_persistent_session(self, websocket_url: str):
        """
        Connects Playwright to a persistent Steel session over CDP.
        Returns (pw, browser, page).
        Does NOT close the browser/session upon completion.
        """
        try:
            from patchright.async_api import async_patchright
            pw = await async_patchright().start()
        except ImportError:
            from playwright.async_api import async_playwright
            pw = await async_playwright().start()

        browser = await pw.chromium.connect_over_cdp(websocket_url)
        context = browser.contexts[0] if browser.contexts else await browser.new_context()
        page = context.pages[0] if context.pages else await context.new_page()
        return pw, browser, page

    async def get_browser(self):
        async with self._lock:
            if self._browser is None:
                # Try patchright first (driver-level stealth), fallback to standard playwright
                try:
                    from patchright.async_api import async_patchright
                    logger.info("Initializing Patchright driver-level stealth browser...")
                    self._playwright = await async_patchright().start()
                except ImportError:
                    from playwright.async_api import async_playwright
                    logger.info("Patchright not found, initializing standard Playwright driver...")
                    self._playwright = await async_playwright().start()

                # Connect to Steel.dev Cloud via CDP WebSocket when steel_api_key is present
                if settings.steel_api_key:
                    cdp_url = f"wss://connect.steel.dev?apiKey={settings.steel_api_key}"
                    try:
                        logger.info("Connecting to Steel.dev Cloud stealth fleet via CDP WebSocket...")
                        self._browser = await self._playwright.chromium.connect_over_cdp(cdp_url)
                        self.is_steel_cloud = True
                        logger.info(f"Connected to Steel.dev Cloud browser successfully (version {self._browser.version}).")
                    except Exception as steel_err:
                        logger.warning(f"Steel.dev Cloud CDP connection failed: {steel_err}. Falling back to local Chromium...")
                        self.is_steel_cloud = False

                # Fallback to local Chromium launch if Steel.dev unavailable or key omitted
                if self._browser is None:
                    try:
                        self._browser = await self._playwright.chromium.launch(
                            headless=settings.headless,
                            args=[
                                "--disable-blink-features=AutomationControlled",
                                "--no-sandbox",
                                "--disable-dev-shm-usage",
                                "--disable-gpu",
                            ]
                        )
                        self.is_steel_cloud = False
                        logger.info("Local Chromium browser launched successfully.")
                    except Exception as launch_err:
                        logger.error(f"Failed to launch local browser: {launch_err}")
                        raise

            return self._browser

    async def create_stealth_context(self) -> Any:
        browser = await self.get_browser()
        context = await browser.new_context(
            viewport={"width": settings.viewport_width, "height": settings.viewport_height},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            locale="en-US",
            timezone_id="Asia/Kolkata",
            bypass_csp=True,
        )

        # Apply stealth scripts to remove navigator.webdriver and common fingerprint leakages
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            window.chrome = {
                runtime: {}
            };
        """)
        return context

    async def close(self):
        async with self._lock:
            if self._browser:
                try:
                    await self._browser.close()
                except Exception:
                    pass
                self._browser = None
            if self._playwright:
                try:
                    await self._playwright.stop()
                except Exception:
                    pass
                self._playwright = None
            self.is_steel_cloud = False
            logger.info("Browser pool shutdown clean.")

browser_pool = BrowserPoolManager(max_concurrent=settings.max_parallel_workers)
