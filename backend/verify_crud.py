"""
verify_crud.py - Live CRUD verification for the Student Management System.
Uses timestamped emails to avoid collisions with leftover test data.
"""

import urllib.request
import urllib.error
import json
import sys
import time

BASE = "http://127.0.0.1:8000"
PASS = []
FAIL = []
# Use timestamp to ensure unique emails across runs
TS = str(int(time.time()))


def req(method, path, body=None):
    url = BASE + path
    data = json.dumps(body).encode() if body else None
    r = urllib.request.Request(
        url, data=data, method=method,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(r) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw) if raw else {}
        except Exception:
            return e.code, {}
    except urllib.error.URLError as e:
        print("[ERROR] Cannot connect to server: " + str(e))
        print("[ERROR] Start Django: python manage.py runserver")
        sys.exit(1)


def check(name, got, want, body=None, key=None):
    ok = got == want
    if key and ok:
        ok = key in (body or {})
    label = "PASS" if ok else "FAIL"
    detail = "  got=" + str(got) + " want=" + str(want)
    if key:
        found = key in (body or {})
        detail += "  key='" + key + "' " + ("found" if found else "MISSING")
    print("  [" + label + "] " + name + detail)
    if ok:
        PASS.append(name)
    else:
        FAIL.append(name)
    return ok


# ── Unique test data (timestamped) ───────────────────────────────────────────
EMAIL1 = "alice_" + TS + "@example.com"
EMAIL2 = "bob_" + TS + "@example.com"

print("=" * 62)
print("  STUDENT MANAGEMENT SYSTEM - LIVE CRUD VERIFICATION")
print("=" * 62)
print("  Test emails: " + EMAIL1 + " / " + EMAIL2)
print()

# 1. API ROOT
print("--- API ROOT ---")
s, b = req("GET", "/")
check("API root reachable (200)", s, 200)
check("Response has 'endpoints' key", s, 200, b, "endpoints")
print()

# 2. CREATE (POST)
print("--- CREATE (POST /api/students/) ---")
payload1 = {"name": "Alice Johnson", "email": EMAIL1,
            "phone": "+91-9876543210", "department": "Computer Science", "year": 2}
s, b = req("POST", "/api/students/", payload1)
check("Create student -> 201", s, 201)
check("Response has 'student' key", s, 201, b, "student")
check("Response has 'message' key", s, 201, b, "message")
student_id = b.get("student", {}).get("id")
check("Created student has an ID", bool(student_id), True)
print("  Student ID: " + str(student_id))
print()

payload2 = {"name": "Bob Smith", "email": EMAIL2,
            "phone": "5550200", "department": "Mathematics", "year": 3}
s, b2 = req("POST", "/api/students/", payload2)
check("Create 2nd student -> 201", s, 201)
student2_id = b2.get("student", {}).get("id")
print()

# 3. READ ALL
print("--- READ ALL (GET /api/students/) ---")
s, b = req("GET", "/api/students/")
check("List students -> 200", s, 200)
check("Has 'count' key", s, 200, b, "count")
check("Has 'results' key", s, 200, b, "results")
print("  Total students in DB: " + str(b.get("count", 0)))
print()

# 4. READ ONE
print("--- READ ONE (GET /api/students/{id}/) ---")
s, b = req("GET", "/api/students/" + str(student_id) + "/")
check("Get one student -> 200", s, 200)
check("Name matches Alice Johnson", b.get("name"), "Alice Johnson")
check("Email matches " + EMAIL1, b.get("email"), EMAIL1)
check("Department = Computer Science", b.get("department"), "Computer Science")
check("Year = 2", b.get("year"), 2)
check("Has created_at", "created_at" in b, True)
check("Has updated_at", "updated_at" in b, True)
print()

# 5. SEARCH
print("--- SEARCH (?search=) ---")
s, b = req("GET", "/api/students/?search=alice_" + TS)
check("Search by partial email finds Alice -> count>=1", b.get("count", 0) >= 1, True)

s, b = req("GET", "/api/students/?search=Mathematics")
check("Search by dept 'Mathematics' -> count>=1", b.get("count", 0) >= 1, True)

s, b = req("GET", "/api/students/?search=XYZNOTEXIST999")
check("Search no match -> count=0", b.get("count"), 0)
print()

# 6. FULL UPDATE (PUT)
print("--- FULL UPDATE (PUT /api/students/{id}/) ---")
put_data = {"name": "Alice Johnson", "email": EMAIL1,
            "phone": "+91-9876543210", "department": "Data Science", "year": 3}
s, b = req("PUT", "/api/students/" + str(student_id) + "/", put_data)
check("PUT update -> 200", s, 200)
check("Department updated to Data Science", b.get("student", {}).get("department"), "Data Science")
check("Year updated to 3", b.get("student", {}).get("year"), 3)
print()

# 7. PARTIAL UPDATE (PATCH)
print("--- PARTIAL UPDATE (PATCH /api/students/{id}/) ---")
s, b = req("PATCH", "/api/students/" + str(student_id) + "/", {"year": 4})
check("PATCH update -> 200", s, 200)
check("Year updated to 4", b.get("student", {}).get("year"), 4)
print()

# 8. VERIFY PERSISTENCE
print("--- VERIFY DB PERSISTENCE ---")
s, b = req("GET", "/api/students/" + str(student_id) + "/")
check("Re-read after updates -> 200", s, 200)
check("Year=4 persisted in DB", b.get("year"), 4)
check("Department='Data Science' persisted in DB", b.get("department"), "Data Science")
print()

# 9. VALIDATION (400 errors)
print("--- VALIDATION ERRORS (400) ---")
s, b = req("POST", "/api/students/",
           {"email": "x@x.com", "phone": "1234567", "department": "CS", "year": 1})
check("Missing name -> 400", s, 400)
check("Error has 'name' field", s, 400, b, "name")

s, b = req("POST", "/api/students/",
           {"name": "T", "email": "NOT_AN_EMAIL", "phone": "1234567", "department": "CS", "year": 1})
check("Invalid email format -> 400", s, 400)
check("Error has 'email' field", s, 400, b, "email")

s, b = req("POST", "/api/students/",
           {"name": "Dup", "email": EMAIL1, "phone": "9876543210", "department": "CS", "year": 1})
check("Duplicate email -> 400", s, 400)
check("Error has 'email' field (dup)", s, 400, b, "email")

s, b = req("POST", "/api/students/",
           {"name": "T", "email": "yr@ex.com", "phone": "1234567", "department": "CS", "year": 10})
check("Year out of range (10) -> 400", s, 400)
check("Error has 'year' field", s, 400, b, "year")

s, b = req("POST", "/api/students/",
           {"name": "T", "email": "ph@ex.com", "phone": "ABCXYZ", "department": "CS", "year": 1})
check("Invalid phone -> 400", s, 400)
check("Error has 'phone' field", s, 400, b, "phone")

s, b = req("POST", "/api/students/",
           {"name": "", "email": "mt@ex.com", "phone": "1234567", "department": "CS", "year": 1})
check("Empty name -> 400", s, 400)
print()

# 10. NOT FOUND (404)
print("--- NOT FOUND (404) ---")
s, b = req("GET", "/api/students/99999/")
check("GET non-existent -> 404", s, 404)
check("404 response has 'error' field", s, 404, b, "error")

s, b = req("PUT", "/api/students/99999/",
           {"name": "G", "email": "g@g.com", "phone": "1234567", "department": "CS", "year": 1})
check("PUT non-existent -> 404", s, 404)

s, b = req("DELETE", "/api/students/99999/")
check("DELETE non-existent -> 404", s, 404)
print()

# 11. DELETE
print("--- DELETE (DELETE /api/students/{id}/) ---")
s, b = req("DELETE", "/api/students/" + str(student2_id) + "/")
check("Delete Bob -> 204", s, 204)

s, b = req("GET", "/api/students/" + str(student2_id) + "/")
check("Deleted student not in DB -> 404", s, 404)
print()

# SUMMARY
total = len(PASS) + len(FAIL)
print("=" * 62)
print("  CRUD RESULTS: " + str(len(PASS)) + "/" + str(total) + " checks passed")
print("=" * 62)
if FAIL:
    print("\nFAILED:")
    for f in FAIL:
        print("  - " + f)
    sys.exit(1)
else:
    print("\nALL CHECKS PASSED - FULL CRUD VERIFIED AGAINST DATABASE")
    sys.exit(0)
