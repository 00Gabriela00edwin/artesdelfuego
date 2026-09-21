import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAvailableMaterials, isProtectedBaseMaterial } from './materials.js';
import { getBaseUnit, formatStock } from './stockUtils.js';

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

test('Las categorías contadas por unidad no muestran sufijos de peso', () => {
  assert.equal(getBaseUnit('MATERIALES DE HORNO'), '');
  assert.equal(getBaseUnit('HERRAMIENTAS'), '');
  assert.equal(formatStock(10, 'MATERIALES DE HORNO'), '10');
  assert.equal(formatStock(10, 'HERRAMIENTAS'), '10');
  assert.equal(formatStock(1250, 'MATERIALES SECOS'), '1.25 kg');
});
