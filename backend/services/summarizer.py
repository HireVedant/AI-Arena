def generate_summary(query: str, responses: dict) -> str:
    valid = [r.get("text") for r in responses.values() if isinstance(r, dict) and isinstance(r.get("text"), str)]

    if not valid:
        return "No valid responses."

    return "\n\n---\n\n".join(valid)