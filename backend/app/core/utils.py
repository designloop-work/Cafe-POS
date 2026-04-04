from bson import ObjectId

def doc(d: dict) -> dict:
    """Convert MongoDB _id to string id."""
    if d and "_id" in d:
        d["id"] = str(d.pop("_id"))
    return d

def to_oid(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except Exception:
        return None
