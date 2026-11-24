"""
W3C C14N DOM Canonicalization and 4-Leaf Merkle Proof Engine.

Provides zero-dependency deterministic HTML/DOM normalization and SHA-256 Merkle
tree proof generation for transparent, tamper-evident web pricing verification.
"""

import hashlib
import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from typing import Dict, Any, Union, Optional


class W3CC14NParser(HTMLParser):
    """
    Deterministic HTML parser following W3C C14N DOM Canonicalization principles:
    - Strips volatile and non-deterministic tags (<script>, <style>, <noscript>, <iframe>, <svg>, <meta>, <link>, <head>)
    - Strips all HTML comments
    - Sorts attributes lexicographically by lowercase attribute name
    - Normalizes attribute quotes to double quotes and escapes special entities
    - Collapses consecutive whitespace in text nodes and trims boundaries
    """

    VOID_TAGS = {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    }

    VOLATILE_CONTAINER_TAGS = {
        "script",
        "style",
        "noscript",
        "iframe",
        "svg",
        "head",
        "template",
    }

    VOLATILE_TAGS = VOLATILE_CONTAINER_TAGS | {"meta", "link", "base"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.output_chunks = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list):
        tag_lower = tag.lower()

        # Safety reset if body begins to prevent unclosed head/meta tags from dropping body content
        if tag_lower == "body" and self._skip_depth > 0:
            self._skip_depth = 0

        # Discard volatile void tags without incrementing skip depth
        if tag_lower in self.VOID_TAGS and tag_lower in self.VOLATILE_TAGS:
            return

        # Increment skip depth for volatile container tags
        if tag_lower in self.VOLATILE_CONTAINER_TAGS:
            self._skip_depth += 1
            return

        if self._skip_depth > 0:
            return

        # Sort attributes lexicographically by key
        sorted_attrs = sorted(attrs, key=lambda a: a[0].lower())
        attr_tokens = []
        for key, val in sorted_attrs:
            key_clean = key.lower().strip()
            # Escape attribute values
            val_clean = (val or "").replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")
            attr_tokens.append(f'{key_clean}="{val_clean}"')

        attr_str = f" {' '.join(attr_tokens)}" if attr_tokens else ""
        self.output_chunks.append(f"<{tag_lower}{attr_str}>")

    def handle_endtag(self, tag: str):
        tag_lower = tag.lower()
        if tag_lower in self.VOLATILE_CONTAINER_TAGS:
            if self._skip_depth > 0:
                self._skip_depth -= 1
            return

        if self._skip_depth > 0:
            return

        self.output_chunks.append(f"</{tag_lower}>")

    def handle_data(self, data: str):
        if self._skip_depth > 0:
            return
        # Normalize and collapse whitespace
        text = re.sub(r"\s+", " ", data).strip()
        if text:
            escaped = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            self.output_chunks.append(escaped)

    def handle_comment(self, data: str):
        # Comments are discarded per W3C C14N
        pass

    def get_canonical_dom(self) -> str:
        return "".join(self.output_chunks)


def canonicalize_dom(raw_html: str) -> str:
    """
    Canonicalizes an arbitrary raw HTML string into deterministic W3C C14N format.
    """
    if not raw_html:
        return ""
    parser = W3CC14NParser()
    try:
        parser.feed(raw_html)
        parser.close()
        return parser.get_canonical_dom()
    except Exception:
        # Fallback safe regex-based canonicalization
        clean = re.sub(r"<!--.*?-->", "", raw_html, flags=re.DOTALL)
        clean = re.sub(r"<(script|style|svg|iframe|meta|link)[^>]*>.*?</\1>", "", clean, flags=re.DOTALL | re.IGNORECASE)
        clean = re.sub(r"\s+", " ", clean).strip()
        return clean


class MerkleProofEngine:
    """
    Constructs and verifies 4-leaf cryptographic Merkle trees:
      Leaf 0: Price Claim
      Leaf 1: Flight Identity
      Leaf 2: Itinerary Route
      Leaf 3: Canonical DOM Extract
    """

    @classmethod
    def _sha256(cls, data: Union[str, bytes]) -> str:
        if isinstance(data, str):
            data = data.encode("utf-8")
        return hashlib.sha256(data).hexdigest()

    @classmethod
    def build_4leaf_proof(
        cls,
        price: Union[float, int, str, dict],
        flight: Union[str, dict, Any],
        itinerary: Union[str, dict, Any],
        raw_html: str
    ) -> Dict[str, Any]:
        """
        Builds a 4-leaf Merkle Proof for an autonomous booking verification.
        Returns:
            merkle_root: hex string of the root hash
            leaves: map of the 4 leaves with leaf payload and SHA-256 hash
            composite_proof_token: verifiable high-integrity proof token
        """
        timestamp = datetime.now(timezone.utc).isoformat()

        # Leaf 0: Price Claim
        if isinstance(price, (float, int)):
            price_norm = f"₹{price:,.2f}"
        elif isinstance(price, dict):
            price_norm = json.dumps(price, sort_keys=True)
        else:
            price_norm = str(price).strip()
        leaf_0_payload = f"CLAIM_PRICE:{price_norm}"
        h0 = cls._sha256(leaf_0_payload)

        # Leaf 1: Flight Identity
        if isinstance(flight, dict):
            flight_norm = json.dumps(flight, sort_keys=True)
        elif hasattr(flight, "airline"):
            flight_norm = f"{flight.airline} ({getattr(flight, 'flight_number', 'N/A')})"
        else:
            flight_norm = str(flight).strip()
        leaf_1_payload = f"FLIGHT_IDENTITY:{flight_norm}"
        h1 = cls._sha256(leaf_1_payload)

        # Leaf 2: Itinerary
        if isinstance(itinerary, dict):
            itinerary_norm = json.dumps(itinerary, sort_keys=True)
        else:
            itinerary_norm = str(itinerary).strip()
        leaf_2_payload = f"ITINERARY:{itinerary_norm}"
        h2 = cls._sha256(leaf_2_payload)

        # Leaf 3: Canonical DOM Extract
        c14n_dom = canonicalize_dom(raw_html)
        leaf_3_payload = f"CANONICAL_DOM:{c14n_dom}"
        h3 = cls._sha256(leaf_3_payload)

        # Merkle Tree Construction (Level 1)
        h01 = cls._sha256(f"{h0}:{h1}")
        h23 = cls._sha256(f"{h2}:{h3}")

        # Merkle Root (Level 2)
        merkle_root = cls._sha256(f"{h01}:{h23}")

        # High-integrity composite proof token
        token_epoch = int(datetime.now(timezone.utc).timestamp())
        composite_proof_token = f"GB-C14N-{merkle_root[:16]}-{h01[:8]}-{h23[:8]}-{token_epoch}"

        preview_len = 200
        dom_preview = c14n_dom[:preview_len] + ("..." if len(c14n_dom) > preview_len else "")

        leaves = {
            "price_claim": {
                "index": 0,
                "label": "Price Claim",
                "data": leaf_0_payload,
                "hash": h0
            },
            "flight_identity": {
                "index": 1,
                "label": "Flight Identity",
                "data": leaf_1_payload,
                "hash": h1
            },
            "itinerary": {
                "index": 2,
                "label": "Itinerary Route",
                "data": leaf_2_payload,
                "hash": h2
            },
            "canonical_dom": {
                "index": 3,
                "label": "Canonical DOM Extract",
                "data": leaf_3_payload,
                "preview": f"CANONICAL_DOM:{dom_preview}",
                "full_canonical_dom": c14n_dom,
                "dom_length": len(c14n_dom),
                "hash": h3
            }
        }

        return {
            "merkle_root": merkle_root,
            "leaves": leaves,
            "composite_proof_token": composite_proof_token,
            "intermediate_hashes": {
                "h01": h01,
                "h23": h23
            },
            "timestamp_utc": timestamp,
            "spec": "W3C-C14N-DOM-v1"
        }

    @classmethod
    def verify_proof(cls, proof: Dict[str, Any]) -> bool:
        """
        Cryptographically verifies the consistency of a 4-leaf Merkle proof.
        """
        try:
            leaves = proof.get("leaves", {})
            h0 = cls._sha256(leaves["price_claim"]["data"])
            h1 = cls._sha256(leaves["flight_identity"]["data"])
            h2 = cls._sha256(leaves["itinerary"]["data"])

            dom_leaf = leaves["canonical_dom"]
            if "full_canonical_dom" in dom_leaf and dom_leaf["full_canonical_dom"] is not None:
                h3 = cls._sha256(f"CANONICAL_DOM:{dom_leaf['full_canonical_dom']}")
            else:
                h3 = cls._sha256(dom_leaf["data"])

            if h0 != leaves["price_claim"]["hash"]:
                return False
            if h1 != leaves["flight_identity"]["hash"]:
                return False
            if h2 != leaves["itinerary"]["hash"]:
                return False
            if h3 != leaves["canonical_dom"]["hash"]:
                return False

            h01 = cls._sha256(f"{h0}:{h1}")
            h23 = cls._sha256(f"{h2}:{h3}")
            calculated_root = cls._sha256(f"{h01}:{h23}")

            return calculated_root == proof.get("merkle_root")
        except Exception:
            return False
