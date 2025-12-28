import os
import subprocess
import time

def run_command(command, cwd=None):
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=cwd)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    else:
        print(f"Success: {result.stdout.strip()}")
    return result

def create_micro_commit(branch_name, commit_message, pr_title, pr_body, files_to_add=["."]):
    # Ensure on main (assuming local main is the base)
    # We won't pull origin main here to avoid auth issues if not logged in, 
    # but we'll try to branch off current main.
    
    # Create and switch to new branch
    run_command(f"git checkout -b {branch_name}")
    
    # Add files
    for file in files_to_add:
        run_command(f"git add \"{file}\"")
    
    # Commit
    run_command(f"git commit -m \"{commit_message}\"")
    
    # Push (might fail if no remote access, but we try)
    run_command(f"git push origin {branch_name} --force")
    
    # Try PR creation (will fail gracefully if gh not authed)
    pr_cmd = f"gh pr create --title \"{pr_title}\" --body \"{pr_body}\" --head {branch_name} --base main"
    res = run_command(pr_cmd)
    
    if "Success" in f"{res.stdout}":
        # Merge PR if created
        time.sleep(2)
        run_command("gh pr merge --auto --merge")
    
    # Switch back to main for next task
    run_command("git checkout main")

if __name__ == "__main__":
    pass
