"""Publish a reproducible research snapshot from repository reports (no model files)."""
import csv
import json
import shutil
from pathlib import Path
root = Path(__file__).resolve().parents[2]
public = root / 'frontend/public/research'
public.mkdir(parents=True, exist_ok=True)
def rows(name):
    with (root / 'reports/tables' / name).open() as f:
        return list(csv.DictReader(f))
assets = []
for folder, category in [('reports/figures', 'Research'), ('reports/interface', 'Interface'), ('archive/original_run', 'Archive')]:
    for path in sorted((root / folder).glob('*')):
        if path.suffix.lower() not in ('.png', '.jpg', '.jpeg'):
            continue
        target = f'{category.lower()}-{path.name}'
        shutil.copy2(path, public / target)
        assets.append({'src': f'/research/{target}', 'name': path.stem.replace('_', ' ').replace('-', ' '), 'category': category, 'source': str(path.relative_to(root))})
comparison = rows('model_comparison.csv')
cv = {r['Model']: r for r in rows('cv_comparison.csv')}
for row in comparison:
    row.update({k: v for k, v in cv[row['Model']].items() if k != 'Model'})
    for key in row:
        if key != 'Model': row[key] = float(row[key])
data = {'models': comparison, 'summary': json.loads((root/'reports/tables/data_summary.json').read_text()), 'metadata': json.loads((root/'models/metadata.json').read_text()), 'parameters': rows('best_hyperparameters.csv')[0], 'assets': assets}
(root/'frontend/src/behind/research.json').write_text(json.dumps(data, indent=2)+'\n')
print(f'Synced {len(assets)} original images and {len(comparison)} model results.')
