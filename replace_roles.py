import os

files = [
    "01_Problem_Statement.md",
    "02_Requirements.md",
    "03_Actor_UseCase.md",
    "04_UseCase_Specifications.md",
    "05_Activity_Diagrams.md",
    "06_Sequence_Diagrams.md",
    "07_ERDnew.md",
    "08_Data_Dictionary.md",
    "09_DFD.md",
    "10_Class_Diagram.md",
    "11_Sitemap.md",
    "12_Business_RulesNew.md",
    "13_State_Diagrams.md",
    "14_BPMN_Business_Processes.md",
    "FitFuel_Plus_Project.md",
    "FitFuel_System_Analysis.md"
]

for f in files:
    path = os.path.join(r"d:\doanWEDKD", f)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as file:
            content = file.read()
        
        # Replace occurrences
        content = content.replace("Gym Owner (Admin)", "Admin")
        content = content.replace("Gym Owner", "Admin")
        content = content.replace("gym owner", "admin")
        content = content.replace("gym_owner", "admin")
        content = content.replace("GYM OWNER", "ADMIN")
        content = content.replace("Gym owner", "Admin")
        
        with open(path, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Updated {f}")
