import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAvailableMaterials, isProtectedBaseMaterial } from './materials.js';

test('YESO sigue disponible aunque exista un registro de eliminación en Firebase', () => {
  const categories = [
    {
      name: 'ARCILLAS',
      materials: ['APM 112', 'TINCAR Z', 'YESO', 'BENTONITA']
    }
  ];

  const available = buildAvailableMaterials(categories, ['ARCILLAS-YESO', 'ARCILLAS-BENTONITA'], []);

  assert.ok(available[0].materials.includes('YESO'));
  assert.ok(!available[0].materials.includes('BENTONITA'));
  assert.equal(isProtectedBaseMaterial('ARCILLAS-YESO'), true);
});
