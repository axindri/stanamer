import re

from app.schemas import NamingStyle

_CAMEL_BOUNDARY = re.compile(r"(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])")
_SPLIT_SEP = re.compile(r"[_\-\s]+")


def _tokens(part: str) -> list[str]:
    text = part.strip()
    if not text:
        return []
    spaced = _CAMEL_BOUNDARY.sub(" ", text)
    return [token.lower() for token in _SPLIT_SEP.split(spaced) if token]


def _join_tokens(tokens: list[str], style: NamingStyle) -> str:
    if not tokens:
        return ""
    if style is NamingStyle.SNAKE_CASE:
        return "_".join(tokens)
    if style is NamingStyle.KEBAB_CASE:
        return "-".join(tokens)
    if style is NamingStyle.CAMEL_CASE:
        first, *rest = tokens
        return first + "".join(token.capitalize() for token in rest)
    # PascalCase
    return "".join(token.capitalize() for token in tokens)


def apply_naming_style(name: str, style: NamingStyle) -> str:
    """Convert an identifier to the requested style, preserving dotted segments."""
    segments = name.split(".")
    converted = [_join_tokens(_tokens(segment), style) for segment in segments]
    # Drop empty segments that appeared from odd input, but keep structure for dots
    converted = [segment for segment in converted if segment]
    return ".".join(converted)
