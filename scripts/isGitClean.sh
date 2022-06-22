if [ -z "$(git status --porcelain)" ]; then 
  # Working directory clean
  echo "✅ git history is clean"
  exit 0
else 
  # Uncommitted changes
  echo "🛑 git history not clean"
  exit 1
fi