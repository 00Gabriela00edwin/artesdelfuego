import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Package, AlertTriangle, Layers, Clock, Trash2, Download, Lock, X, FlaskConical, Calculator, Plus } from 'lucide-react';
import { db } from './firebase';

const gresMaterials = [
  { name: 'Bordo', formula: 'Feldespato 45% · Sílice 30% · Caolín 15% · Óxido de hierro 10%' },
  { name: 'Niebla del Monte', formula: 'Feldespato 42% · Sílice 28% · Caolín 20% · Rutilo 10%' },
  { name: 'Azul Profundo', formula: 'Feldespato 48% · Sílice 27% · Caolín 18% · Óxido de cobalto 7%' },
  { name: 'Verde Oliva', formula: 'Feldespato 44% · Sílice 30% · Caolín 18% · Óxido de cromo 8%' },
  { name: 'Celeste de Río', formula: 'Feldespato 46% · Sílice 29% · Caolín 20% · Carbonato de cobre 5%' },
  { name: 'Arena Antigua', formula: 'Feldespato 40% · Sílice 32% · Caolín 18% · Óxido de hierro 10%' },
  { name: 'Rojo Tierra', formula: 'Feldespato 43% · Sílice 30% · Caolín 17% · Óxido de hierro 10%' },
  { name: 'Turquesa Mineral', formula: 'Feldespato 45% · Sílice 28% · Caolín 20% · Carbonato de cobre 7%' },
  { name: 'Amarillo Azafrán', formula: 'Feldespato 47% · Sílice 30% · Caolín 18% · Rutilo 5%' },
  { name: 'Marrón Ceniza', formula: 'Feldespato 41% · Sílice 31% · Caolín 18% · Óxido de hierro 10%' },
  { name: 'Blanco Nube', formula: 'Feldespato 50% · Sílice 30% · Caolín 20%' },
  { name: 'Rosa Arcilla', formula: 'Feldespato 46% · Sílice 30% · Caolín 19% · Óxido de estaño 5%' },
  { name: 'Negro Volcánico', formula: 'Feldespato 40% · Sílice 28% · Caolín 17% · Óxidos colorantes 15%' },
  { name: 'Gris Humo', formula: 'Feldespato 45% · Sílice 32% · Caolín 18% · Óxido de manganeso 5%' },
  { name: 'Violeta Bruma', formula: 'Feldespato 47% · Sílice 29% · Caolín 19% · Óxido de manganeso 5%' },
  { name: 'Azul Noche', formula: 'Feldespato 45% · Sílice 30% · Caolín 18% · Óxido de cobalto 7%' },
  { name: 'Rojo Selenio', formula: 'Feldespato 44% · Sílice 30% · Caolín 20% · Selenio 6%' },
  { name: 'Verde Bosque', formula: 'Feldespato 43% · Sílice 29% · Caolín 20% · Óxido de cromo 8%' },
  { name: 'Cobre Quemado', formula: 'Feldespato 42% · Sílice 31% · Caolín 19% · Carbonato de cobre 8%' },
  { name: 'Marfil Mate', formula: 'Feldespato 48% · Sílice 27% · Caolín 20% · Óxido de estaño 5%' },
  { name: 'Azul Ceniza', formula: 'Feldespato 44% · Sílice 30% · Caolín 21% · Óxido de cobalto 5%' },
  { name: 'Piedra Lunar', formula: 'Feldespato 46% · Sílice 30% · Caolín 19% · Rutilo 5%' },
  { name: 'Ocre Serrano', formula: 'Feldespato 43% · Sílice 31% · Caolín 16% · Óxido de hierro 10%' },
  { name: 'Habano Satinado', formula: 'Feldespato 42% · Sílice 30% · Caolín 18% · Óxido de hierro 10%' }
];

const categories = [
  {
    name: "MATERIALES SECOS",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: ["OX ZINC", "OX ESTAÑO", "ARENA DE RUTILO", "SILICATO ZIRCONIO", "COLEMANITA", "Carbonato de calcio", "DOLOMITA AUKAN", "CHAMOTE 30#", "FELDESPATO", "CUARZO", "WOLLASTONITA", "SIENITA NEFELINA", "ESPODUMENO", "BASALTO", "TALCO", "FOSFATO TRICALCICO", "CARBONATO DE ESTRONCIO", "CARBONATO DE BARIO", "CARBONATO DE MAGNESIO", "OXIDO DE ALUMINIO"]
  },
  {
    name: "OXIDOS COLORANTES",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: ["OX NIQUEL", "OX CROMO", "OX COBRE", "OX MANGANESO", "OX HIERRO", "OX DE COBALTO"]
  },
  {
    name: "ARCILLAS",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: ["APM 112", "TINCAR Z", "AUKAN ROJA", "AUKAN MARRON", "AUKAN OCRE", "PUMA", "CAOLIN SRB", "CAOLIN PATAGONICO", "BENTONITA", "CONO 28 XXX", "PASTA CHILAVERT", "YESO"]
  },
  {
    name: "DESFLOCULANTE",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: ["CARB SODIO", "TRIPOLISFOSFATO DE SODIO"]
  },
  {
    name: "FUNDENTES",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: ["F 174", "BASE 804", "Q 92", "BORAX", "FLUX 12005"]
  },
  {
    name: "ESMALTES EN POLVO BAJA",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: ["JASPEADO", "ROJO SELENIO", "TURQUEZA", "RUBY", "MARRON", "AMARILLO", "NARANJA", "BLANCO", "ROSA", "NEGRO", "GRIS", "VERDE", "VIOLETA", "AZUL", "ROJO", "RS"]
  },
  {
    name: "ESMALTES DE GRES",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: gresMaterials.map(material => material.name)
  },
  {
    name: "PIGMENTOS B/C",
    bgClass: "bg-[#3e261b] border-[#b96f48]",
    materials: ["AZ 63", "AZ 60", "AZ64", "NG13", "NG10", "MR21", "MR20", "MR55", "RJ30", "RJ38", "RJ39", "RJ36", "RS32", "LI34", "GR12", "AM56", "verde40", "verde41", "naranja55"]
  }
];

const liquidCategories = new Set(['DESFLOCULANTE', 'ESMALTES DE GRES']);
const gresCategoryName = 'ESMALTES DE GRES';
const unitOptions = {
  dry: ['g', 'kg', 'mg'],
  liquid: ['ml', 'L']
};

const getCategoryForMaterial = (material, categoryList = categories) => categoryList.find(category => category.materials.includes(material));
const getGresFormula = (material) => gresMaterials.find(item => item.name === material)?.formula || '';
const getUnitOptions = (categoryName) => liquidCategories.has(categoryName) ? unitOptions.liquid : unitOptions.dry;
const getBaseUnit = (categoryName) => liquidCategories.has(categoryName) ? 'ml' : 'g';
const getCostUnit = (categoryName) => liquidCategories.has(categoryName) ? 'L' : 'kg';
const toBaseCost = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0 ? numericValue / 1000 : null;
};
const formatCurrency = (value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 }).format(value);
const toBaseUnits = (value, unit) => {
  const numericValue = Number(value);
  if (unit === 'kg' || unit === 'L') return numericValue * 1000;
  if (unit === 'mg') return numericValue / 1000;
  return numericValue;
};
const maxStockPerMaterial = 10000;
const minimumStock = 250;
const getMaxStockForCategory = (categoryName) => categoryName === gresCategoryName ? 20000 : maxStockPerMaterial;
const formatStock = (baseValue, categoryName) => {
  if (liquidCategories.has(categoryName)) {
    return baseValue >= 1000 ? `${baseValue / 1000} L` : `${baseValue} ml`;
  }
  if (baseValue >= 1000) return `${baseValue / 1000} kg`;
  if (baseValue >= 1) return `${baseValue} g`;
  return `${baseValue * 1000} mg`;
};
const escapeCsvValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const downloadCsv = (filename, headers, rows) => {
  const csv = [headers, ...rows].map(row => row.map(escapeCsvValue).join(';')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const parseFormula = (composition) => composition.split(/[·,\n]+/).map(part => {
  const match = part.trim().match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s*%$/);
  return match ? { ingredient: match[1].trim(), percentage: match[2].replace(',', '.') } : null;
}).filter(Boolean);
const formatCalculatedAmount = (value, unit) => {
  if (!Number.isFinite(value)) return '0';
  if (unit === 'kg' || unit === 'L') return `${value.toFixed(3).replace(/\.000$/, '')} ${unit}`;
  if (unit === 'g' || unit === 'ml') return `${value.toFixed(2).replace(/\.00$/, '')} ${unit}`;
  return `${value.toFixed(3)} ${unit}`;
};

export default function App() {
  const [taller, setTaller] = useState('Posadas');
  const [customMaterials, setCustomMaterials] = useState([]);
  const [deletedBaseMaterials, setDeletedBaseMaterials] = useState([]);
  const [materialError, setMaterialError] = useState('');
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newMaterialCategory, setNewMaterialCategory] = useState('');
  const [newMaterialName, setNewMaterialName] = useState('');
  const [newMaterialAmount, setNewMaterialAmount] = useState('');
  const [newMaterialUnit, setNewMaterialUnit] = useState('g');
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);
  const [inventory, setInventory] = useState(() => {
    const initial = {};
    ['Posadas', 'Oberá'].forEach(loc => {
      categories.forEach(cat => {
        cat.materials.forEach(mat => {
          initial[`${loc}-${mat}`] = { stock: 0, unit: getBaseUnit(cat.name), unitCostBase: 0 };
        });
      });
    });
    return initial;
  });

  const [history, setHistory] = useState([]);
  const [selectedMat, setSelectedMat] = useState('');
  const [materialQuery, setMaterialQuery] = useState('');
  const [isMaterialListOpen, setIsMaterialListOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('g');
  const [quickMovePin, setQuickMovePin] = useState('');
  const [isQuickMovePinOpen, setIsQuickMovePinOpen] = useState(false);
  const [isQuickMoveAuthorized, setIsQuickMoveAuthorized] = useState(false);
  const [quickMovePinError, setQuickMovePinError] = useState('');
  const [pendingQuickMoveAction, setPendingQuickMoveAction] = useState(null);
  const [responsible, setResponsible] = useState('');
  const [destination, setDestination] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [formulaDrafts, setFormulaDrafts] = useState({});
  const [openFormula, setOpenFormula] = useState('');
  const emptyLabForm = { name: '', date: new Date().toISOString().slice(0, 10), resultDate: '', addedBy: '', composition: '', shrinkage: '', density: '', firing: '', observations: '', imageUrl: '', imageName: '' };
  const [labForms, setLabForms] = useState({ pastas: { ...emptyLabForm }, barbotinas: { ...emptyLabForm }, esmaltes: { ...emptyLabForm } });
  const [labTrials, setLabTrials] = useState({ pastas: [], barbotinas: [], esmaltes: [] });
  const [editingLabTrialId, setEditingLabTrialId] = useState(null);
  const [activeLabTab, setActiveLabTab] = useState('pastas');
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(new Set());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorFormula, setCalculatorFormula] = useState('manual');
  const [calculatorTotal, setCalculatorTotal] = useState('');
  const [calculatorUnit, setCalculatorUnit] = useState('kg');
  const [calculatorRows, setCalculatorRows] = useState([{ ingredient: '', percentage: '' }]);

  const allCategories = categories.map(category => ({
    ...category,
    materials: [...category.materials.filter(material => !deletedBaseMaterials.includes(`${category.name}-${material}`)), ...customMaterials.filter(material => material.categoryName === category.name).map(material => material.name)]
  }));

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'materials'), snapshot => {
      const nextMaterials = snapshot.docs.map(documentSnapshot => ({ id: documentSnapshot.id, ...documentSnapshot.data() }));
      setCustomMaterials(nextMaterials);
      setMaterialError('');
      setInventory(currentInventory => {
        const nextInventory = { ...currentInventory };
        nextMaterials.forEach(material => {
          const key = `${material.taller || 'Posadas'}-${material.name}`;
          if (!nextInventory[key]) {
            nextInventory[key] = {
              stock: Number(material.initialStock) || 0,
              unit: getBaseUnit(material.categoryName),
              unitCostBase: 0
            };
          }
        });
        return nextInventory;
      });
    }, error => {
      console.error('No se pudieron cargar los materiales de Firebase', error);
      setMaterialError('No se pudieron sincronizar los materiales nuevos con Firebase.');
    });
    return unsubscribe;
  }, []);

  const selectedCategory = getCategoryForMaterial(selectedMat, allCategories);
  const selectedUnitOptions = getUnitOptions(selectedCategory?.name);
  const normalizedQuery = materialQuery.trim().toLocaleLowerCase();
  const filteredCategories = allCategories.map(category => ({
    ...category,
    materials: category.materials.filter(material => material.toLocaleLowerCase().includes(normalizedQuery))
  })).filter(category => category.materials.length > 0);

  const requireAdministrator = () => true;

  const recordMovement = (material, movement, value, movementUnit, movementResponsible, movementDestination, movementCost) => {
    const category = getCategoryForMaterial(material, allCategories);
    const valueInBase = toBaseUnits(value, movementUnit);
    const costInBase = toBaseCost(movementCost);
    if (!category || !Number.isFinite(valueInBase) || valueInBase <= 0) return false;

    const key = `${taller}-${material}`;
    setInventory(currentInventory => {
      const currentStock = currentInventory[key]?.stock || 0;
      const nextStock = movement === 'entrada'
        ? currentStock + valueInBase
        : Math.max(0, currentStock - valueInBase);
      return {
        ...currentInventory,
        [key]: {
          stock: nextStock,
          unit: getBaseUnit(category.name),
          unitCostBase: costInBase === null ? currentInventory[key]?.unitCostBase || 0 : costInBase
        }
      };
    });

    const now = new Date();
    setHistory(currentHistory => [{
      id: Date.now() + Math.random(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      taller,
      material,
      type: movement,
      responsible: movementResponsible.trim(),
      destination: movementDestination.trim(),
      amountVal: valueInBase,
      amountFormatted: `${value} ${movementUnit}`
    }, ...currentHistory]);
    return true;
  };

  const handleMovement = (e, movement) => {
    e.preventDefault();
    if (!requireAdministrator()) return;
    if (!selectedMat || !amount) return false;
    const wasRecorded = recordMovement(selectedMat, movement, amount, unit, responsible, destination, unitCost);
    if (!wasRecorded) return false;
    setAmount('');
    setSelectedMat('');
    setMaterialQuery('');
    setIsMaterialListOpen(false);
    setResponsible('');
    setDestination('');
    setUnitCost('');
    return true;
  };

  const finalizeQuickMove = () => {
    if (pendingQuickMoveAction === 'entrada' || pendingQuickMoveAction === 'salida') {
      handleMovement({ preventDefault: () => {} }, pendingQuickMoveAction);
      setIsQuickMovePinOpen(false);
      setQuickMovePin('');
      setQuickMovePinError('');
      setPendingQuickMoveAction(null);
      return;
    }

    setIsQuickMovePinOpen(false);
    setQuickMovePin('');
    setQuickMovePinError('');
    setPendingQuickMoveAction(null);
  };

  const handleQuickMovePinSubmit = (e) => {
    e.preventDefault();
    if (quickMovePin === '2026') {
      setIsQuickMoveAuthorized(true);
      finalizeQuickMove();
      return;
    }
    setQuickMovePinError('PIN incorrecto');
  };

  const openQuickMovePin = (action) => {
    if (isQuickMoveAuthorized) {
      handleMovement({ preventDefault: () => {} }, action);
      setPendingQuickMoveAction(null);
      return;
    }
    setPendingQuickMoveAction(action);
    setIsQuickMovePinOpen(true);
    setQuickMovePinError('');
  };

  const handleMaterialChange = (value) => {
    setSelectedMat(value);
    setMaterialQuery(value);
    setIsMaterialListOpen(false);
    const category = getCategoryForMaterial(value, allCategories);
    setUnit(getUnitOptions(category?.name)[0]);
  };

  const handleMaterialInput = (value) => {
    setMaterialQuery(value);
    setSelectedMat('');
    setIsMaterialListOpen(true);
  };

  const handleBranchChange = (branch) => {
    setTaller(branch);
    setSelectedMat('');
    setMaterialQuery('');
    setIsMaterialListOpen(false);
  };

  const handleVolumePreset = (volume, volumeUnit) => {
    if (!requireAdministrator()) return;
    setAmount(String(volume));
    setUnit(volumeUnit);
  };

  const handleProtectedChange = (setter, value) => {
    if (requireAdministrator()) setter(value);
  };

  const handleLabFieldChange = (field, value) => {
    if (requireAdministrator()) setLabForms(current => ({ ...current, [activeLabTab]: { ...current[activeLabTab], [field]: value } }));
  };

  const handleLabImageChange = (event) => {
    if (!requireAdministrator()) {
      event.target.value = '';
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLabForms(current => ({
      ...current,
      [activeLabTab]: { ...current[activeLabTab], imageUrl: reader.result, imageName: file.name }
    }));
    reader.readAsDataURL(file);
  };

  const handleLabSubmit = (event) => {
    event.preventDefault();
    const currentForm = labForms[activeLabTab];
    if (!requireAdministrator() || !currentForm.name.trim()) return;
    setLabTrials(current => ({
      ...current,
      [activeLabTab]: editingLabTrialId
        ? current[activeLabTab].map(trial => trial.id === editingLabTrialId ? { ...trial, ...currentForm, name: currentForm.name.trim() } : trial)
        : [{ ...currentForm, id: Date.now() + Math.random(), name: currentForm.name.trim() }, ...current[activeLabTab]]
    }));
    setLabForms(current => ({ ...current, [activeLabTab]: { ...emptyLabForm, date: new Date().toISOString().slice(0, 10) } }));
    setEditingLabTrialId(null);
  };

  const handleLabEdit = (trial) => {
    if (!requireAdministrator()) return;
    setLabForms(current => ({ ...current, [activeLabTab]: { ...emptyLabForm, ...trial } }));
    setEditingLabTrialId(trial.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelLabEdit = () => {
    setLabForms(current => ({ ...current, [activeLabTab]: { ...emptyLabForm, date: new Date().toISOString().slice(0, 10) } }));
    setEditingLabTrialId(null);
  };

  const handleLabDelete = (trialId) => {
    if (!requireAdministrator()) return;
    setLabTrials(current => ({ ...current, [activeLabTab]: current[activeLabTab].filter(trial => trial.id !== trialId) }));
  };

  const handleLabToggle = () => {
    if (isLabOpen) {
      setIsLabOpen(false);
      return;
    }
    if (requireAdministrator()) setIsLabOpen(true);
  };

  const handleCategoryToggle = (categoryName) => {
    setOpenCategories(current => {
      const next = new Set(current);
      if (next.has(categoryName)) next.delete(categoryName);
      else next.add(categoryName);
      return next;
    });
  };

  const openMaterialModal = (categoryName) => {
    if (!requireAdministrator()) return;
    setNewMaterialCategory(categoryName);
    setNewMaterialName('');
    setNewMaterialAmount('');
    setNewMaterialUnit(getUnitOptions(categoryName)[0]);
    setMaterialError('');
    setIsMaterialModalOpen(true);
  };

  const closeMaterialModal = () => {
    if (isSavingMaterial) return;
    setIsMaterialModalOpen(false);
    setMaterialError('');
  };

  const handleDeleteMaterial = async (material, categoryName) => {
    if (!window.confirm(`¿Eliminar el material "${material}" de esta categoría?`)) return;
    const customMaterial = customMaterials.find(item => item.name === material && item.categoryName === categoryName);
    if (!customMaterial?.id) {
      setDeletedBaseMaterials(current => [...current, `${categoryName}-${material}`]);
      setMaterialError('');
      return;
    }

    try {
      await deleteDoc(doc(db, 'materials', customMaterial.id));
      setInventory(currentInventory => {
        const nextInventory = { ...currentInventory };
        delete nextInventory[`${customMaterial.taller || taller}-${material}`];
        return nextInventory;
      });
      if (selectedMat === material) {
        setSelectedMat('');
        setMaterialQuery('');
        setIsMaterialListOpen(false);
      }
    } catch (error) {
      console.error('No se pudo eliminar el material de Firebase', error);
      setMaterialError('No se pudo eliminar el material. Revisa la conexión y los permisos de Firebase.');
    }
  };

  const handleNewMaterialSubmit = async (event) => {
    event.preventDefault();
    const materialName = newMaterialName.trim();
    const amountValue = Number(newMaterialAmount);
    const category = allCategories.find(item => item.name === newMaterialCategory);
    if (!category || !materialName || !Number.isFinite(amountValue) || amountValue < 0) {
      setMaterialError('Completa el nombre y una cantidad válida.');
      return;
    }
    if (category.materials.some(material => material.toLocaleLowerCase() === materialName.toLocaleLowerCase())) {
      setMaterialError('Ya existe un material con ese nombre en esta categoría.');
      return;
    }

    setIsSavingMaterial(true);
    setMaterialError('');
    const materialData = {
      name: materialName,
      categoryName: newMaterialCategory,
      initialStock: toBaseUnits(amountValue, newMaterialUnit),
      initialUnit: newMaterialUnit,
      taller,
      createdAt: serverTimestamp()
    };
    try {
      console.info('[Firebase] Guardando material en la colección "materials"', materialData);
      await addDoc(collection(db, 'materials'), materialData);
      setIsMaterialModalOpen(false);
    } catch (error) {
      console.error('[Firebase] No se pudo guardar el material', {
        code: error?.code || 'sin código',
        name: error?.name || 'Error',
        message: error?.message || String(error),
        stack: error?.stack || 'sin stack disponible',
        collection: 'materials',
        payload: materialData,
        firebaseProject: 'artes-del-fuego'
      });
      setMaterialError('No se pudo guardar el material. Revisa la conexión y los permisos de Firebase.');
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const calculatorTrials = Object.entries(labTrials).flatMap(([type, trials]) => trials.map(trial => ({ ...trial, type })));
  const handleCalculatorFormulaChange = (value) => {
    setCalculatorFormula(value);
    if (value === 'manual') {
      setCalculatorRows([{ ingredient: '', percentage: '' }]);
      return;
    }
    const trial = calculatorTrials.find(item => String(item.id) === value);
    setCalculatorRows(parseFormula(trial?.composition || ''));
    setCalculatorUnit(trial?.type === 'esmaltes' || trial?.type === 'barbotinas' ? 'L' : 'kg');
  };

  const handleCalculatorRowChange = (index, field, value) => {
    setCalculatorRows(current => current.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row));
  };

  const addCalculatorRow = () => {
    setCalculatorRows(current => [...current, { ingredient: '', percentage: '' }]);
  };

  const removeCalculatorRow = (index) => {
    setCalculatorRows(current => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleCalculatorToggle = () => {
    if (isCalculatorOpen) {
      setIsCalculatorOpen(false);
      return;
    }
    setIsCalculatorOpen(true);
  };

  const handleHistoryToggle = () => setIsHistoryOpen(current => !current);

  const handleDeleteMovement = (id, movTaller, movMat, movType, movVal) => {
    if (!requireAdministrator()) return;
    const key = `${movTaller}-${movMat}`;
    setInventory(currentInventory => {
      const currentStock = currentInventory[key]?.stock || 0;
      const revertedStock = movType === 'entrada'
        ? Math.max(0, currentStock - movVal)
        : currentStock + movVal;
      return { ...currentInventory, [key]: { ...currentInventory[key], stock: revertedStock } };
    });
    setHistory(currentHistory => currentHistory.filter(item => item.id !== id));
  };

  const exportInventory = () => {
    const rows = allCategories.flatMap(category => category.materials.map(material => {
      const stock = inventory[`${taller}-${material}`]?.stock || 0;
      return [taller, category.name, material, stock, getBaseUnit(category.name), formatStock(stock, category.name)];
    }));
    downloadCsv(`inventario-${taller.toLowerCase()}.csv`, ['Taller', 'Categoría', 'Material', 'Stock base', 'Unidad base', 'Stock legible'], rows);
  };

  const exportHistory = () => {
    const rows = history.map(movement => [
      movement.date,
      movement.time,
      movement.taller,
      movement.material,
      movement.type,
      movement.amountVal,
      movement.amountFormatted,
      movement.responsible,
      movement.destination
    ]);
    downloadCsv('historial-movimientos.csv', ['Fecha', 'Hora', 'Taller', 'Material', 'Tipo', 'Cantidad base', 'Cantidad registrada', 'Responsable', 'Destino'], rows);
  };

  const exportLabTrials = () => {
    const rows = activeLabTrials.map(trial => [
      labTabLabels[activeLabTab],
      trial.name,
      trial.date,
      trial.resultDate || '',
      trial.addedBy || '',
      trial.composition || '',
      trial.shrinkage || '',
      trial.density || '',
      trial.firing || '',
      trial.observations || '',
      trial.imageName || ''
    ]);
    downloadCsv(`ensayos-${activeLabTab}.csv`, ['Tipo', 'Nombre del ensayo', 'Fecha de elaboración', 'Fecha de resultado', 'Agregado por', 'Composición', 'Contracción (%)', 'Densidad (g/ml)', 'Quema', 'Observaciones', 'Archivo de imagen'], rows);
  };

  const activeLabForm = labForms[activeLabTab];
  const activeLabTrials = labTrials[activeLabTab];
  const labTabLabels = { pastas: 'Pastas', barbotinas: 'Barbotinas', esmaltes: 'Esmaltes' };

  return (
    <div className="artisanal-app flex min-h-screen flex-col p-4 md:p-6 xl:p-8">
      <header className="artisanal-header max-w-7xl mx-auto rounded-2xl p-4 sm:p-6 mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center sm:flex-wrap">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Package className="w-9 h-9" /> Administración de Materiales Artes del Fuego
        </h1>
        <nav className="branch-tabs flex items-center gap-1 rounded-xl p-1 w-full justify-center sm:w-auto" aria-label="Seleccionar sucursal">
          {['Posadas', 'Oberá'].map(branch => (
            <button
              key={branch}
              type="button"
              onClick={() => handleBranchChange(branch)}
              aria-pressed={taller === branch}
              className={`rounded-lg px-4 py-2 text-sm font-bold ${taller === branch ? 'branch-tab-active' : 'branch-tab-idle'}`}
            >
              Taller {branch}
            </button>
          ))}
        </nav>
      </header>

      <section className="artisanal-panel max-w-7xl mx-auto mb-8 p-6 rounded-2xl">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#C85A32] font-bold">Carga rápida</p>
            <h2 className="text-xl font-bold mt-1">Registrar movimiento</h2>
          </div>
          <Layers className="text-[#C85A32]" aria-hidden="true" />
        </div>
        <p className="mb-4 text-sm text-[#C9B9AC]" aria-live="polite">Inventario y métricas de <strong className="text-[#F4ECE1]">Taller {taller}</strong></p>
        <form onSubmit={e => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr_0.9fr_0.9fr] gap-3 items-end">
          <label className="relative text-sm font-semibold">Material
            <input
              type="text"
              value={materialQuery}
              placeholder="Buscar material..."
              autoComplete="off"
              role="combobox"
              aria-expanded={isMaterialListOpen}
              aria-controls="material-results"
              onFocus={() => setIsMaterialListOpen(true)}
              onChange={e => handleMaterialInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') setIsMaterialListOpen(false);
                if (e.key === 'Enter' && filteredCategories[0]?.materials[0]) {
                  e.preventDefault();
                  handleMaterialChange(filteredCategories[0].materials[0]);
                }
              }}
              className="mt-1 w-full p-3 bg-[#1F1815] rounded-lg border border-white/10 focus:border-[#C85A32] outline-none"
            />
            {isMaterialListOpen && (
              <div id="material-results" role="listbox" className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-lg border border-[#C85A32] bg-[#1F1815] p-2 shadow-2xl">
                {filteredCategories.length === 0 ? <p className="p-3 text-sm text-[#C9B9AC]">No se encontraron materiales.</p> : filteredCategories.map(category => (
                  <div key={category.name}>
                    <p className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-[#C85A32]">{category.name}</p>
                    {category.materials.map(material => (
                      <button key={material} type="button" role="option" aria-selected={selectedMat === material} onMouseDown={e => e.preventDefault()} onClick={() => handleMaterialChange(material)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-[#F4ECE1] hover:bg-[#C85A32] hover:text-white">
                        {material}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </label>
          <label className="text-sm font-semibold">Cantidad
            <input type="number" min="0" step="any" placeholder="0" value={amount} onChange={e => handleProtectedChange(setAmount, e.target.value)} className="mt-1 w-full p-3 bg-[#1F1815] rounded-lg" />
          </label>
          <label className="text-sm font-semibold">Unidad
            <select value={unit} onChange={e => handleProtectedChange(setUnit, e.target.value)} className="mt-1 w-full p-3 bg-[#1F1815] rounded-lg">
              {selectedUnitOptions.map(option => <option key={option} value={option}>{option === 'L' ? 'Litros (L)' : option === 'ml' ? 'Mililitros (ml)' : option === 'kg' ? 'Kilos (kg)' : option === 'mg' ? 'Miligramos (mg)' : 'Gramos (g)'}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Costo por {getCostUnit(selectedCategory?.name)} <span className="font-normal opacity-60">(opcional)</span>
            <input type="number" min="0" step="0.01" placeholder="$ 0,00" value={unitCost} onChange={e => handleProtectedChange(setUnitCost, e.target.value)} className="mt-1 w-full p-3 bg-[#1F1815] rounded-lg" />
          </label>
          <label className="text-sm font-semibold">Responsable <span className="font-normal opacity-60">(opcional)</span>
            <input type="text" value={responsible} onChange={e => handleProtectedChange(setResponsible, e.target.value)} placeholder="Ej. Ebal" className="mt-1 w-full p-3 bg-[#1F1815] rounded-lg" />
          </label>
          <label className="text-sm font-semibold">Destino o uso
            <select value={destination} onChange={e => handleProtectedChange(setDestination, e.target.value)} className="mt-1 w-full p-3 bg-[#1F1815] rounded-lg">
              <option value="">Seleccionar destino</option>
              <option value="Taller Posadas">Taller Posadas</option>
              <option value="Taller Oberá">Taller Oberá</option>
              <option value="Guardar en depósito - Caja">Guardar en depósito - Caja</option>
              <option value="Producción local">Producción local</option>
              <option value="Pruebas de esmalte">Pruebas de esmalte</option>
              <option value="Otro">Otro</option>
            </select>
          </label>
        </form>
        {selectedCategory?.name === gresCategoryName && <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
          <span className="text-[#C9B9AC]">Lote de gres:</span>
          <button type="button" onClick={() => handleVolumePreset(20, 'L')} className="px-3 py-1 rounded-full bg-[#5A3D2E] hover:bg-[#C85A32]">Tacho 20 L</button>
          <button type="button" onClick={() => handleVolumePreset(1, 'L')} className="px-3 py-1 rounded-full bg-[#5A3D2E] hover:bg-[#C85A32]">Frasco 1 L</button>
          <span className="text-xs text-[#C9B9AC]">Se registra internamente en ml.</span>
        </div>}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => openQuickMovePin('entrada')} className="rounded-lg bg-green-700 p-3 font-bold text-white hover:bg-green-800">Registrar entrada (+)</button>
          <button type="button" onClick={() => openQuickMovePin('salida')} className="rounded-lg bg-red-700 p-3 font-bold text-white hover:bg-red-800">Registrar salida (-)</button>
        </div>
      </section>

      {isQuickMovePinOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation">
        <form onSubmit={handleQuickMovePinSubmit} className="w-full max-w-sm rounded-2xl border border-[#C85A32] bg-[#2D2420] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="quick-move-pin-title">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="quick-move-pin-title" className="text-xl font-bold text-[#F4ECE1]">PIN de seguridad</h2>
            <button type="button" onClick={() => { setIsQuickMovePinOpen(false); setQuickMovePin(''); setQuickMovePinError(''); setPendingQuickMoveAction(null); }} aria-label="Cerrar PIN"><X size={18} /></button>
          </div>
          <label className="text-sm font-semibold text-[#F4ECE1]">Ingrese el PIN
            <input autoFocus type="password" value={quickMovePin} onChange={e => setQuickMovePin(e.target.value)} className="mt-1 w-full rounded-lg bg-[#1F1815] p-3 text-[#F4ECE1] outline-none focus:border-[#C85A32]" />
          </label>
          {quickMovePinError && <p className="mt-2 text-sm font-bold text-red-300">{quickMovePinError}</p>}
          <button type="submit" className="mt-4 w-full rounded-lg bg-[#C85A32] p-3 font-bold text-white flex items-center justify-center gap-2">
            <Lock size={16} /> Confirmar acceso
          </button>
        </form>
      </div>}

      {isMaterialModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
        <form onSubmit={handleNewMaterialSubmit} className="w-full max-w-md rounded-2xl border border-[#C85A32] bg-[#2D2420] p-6 text-[#F4ECE1] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="new-material-title">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#D49758]">Nuevo material</p>
              <h2 id="new-material-title" className="mt-1 text-xl font-bold">Agregar a {newMaterialCategory}</h2>
            </div>
            <button type="button" onClick={closeMaterialModal} aria-label="Cerrar formulario" className="rounded-lg p-2 hover:bg-white/10"><X size={18} /></button>
          </div>
          <label className="text-sm font-semibold">Nombre o código
            <input autoFocus type="text" value={newMaterialName} onChange={event => setNewMaterialName(event.target.value)} placeholder="Ej. Pigmento nuevo" className="mt-1 w-full rounded-lg bg-[#1F1815] p-3 outline-none ring-1 ring-white/10 focus:ring-[#C85A32]" />
          </label>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
            <label className="text-sm font-semibold">Cantidad inicial
              <input type="number" min="0" step="any" value={newMaterialAmount} onChange={event => setNewMaterialAmount(event.target.value)} placeholder="0" className="mt-1 w-full rounded-lg bg-[#1F1815] p-3 outline-none ring-1 ring-white/10 focus:ring-[#C85A32]" />
            </label>
            <label className="text-sm font-semibold">Unidad
              <select value={newMaterialUnit} onChange={event => setNewMaterialUnit(event.target.value)} className="mt-1 rounded-lg bg-[#1F1815] p-3 outline-none ring-1 ring-white/10 focus:ring-[#C85A32]">
                {getUnitOptions(newMaterialCategory).map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs text-[#C9B9AC]">Stock inicial para Taller {taller}. Se guardará en la colección de materiales de Firebase.</p>
          {materialError && <p className="mt-3 rounded-lg bg-red-950/50 p-3 text-sm font-semibold text-red-200" role="alert">{materialError}</p>}
          <button type="submit" disabled={isSavingMaterial} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C85A32] p-3 font-bold text-white hover:bg-[#A94728] disabled:cursor-wait disabled:opacity-60">
            <Plus size={17} /> {isSavingMaterial ? 'Guardando...' : 'Guardar material'}
          </button>
        </form>
      </div>}

      <section className="artisanal-panel tool-panel order-3 max-w-7xl mx-auto mb-8 w-full rounded-2xl p-5" aria-labelledby="laboratorio-gres-title">
        <div className={`flex items-center justify-between gap-3 ${isLabOpen ? 'mb-6 border-b border-[#b98256]/40 pb-5' : ''}`}>
          <h2 id="laboratorio-gres-title" className="flex items-center gap-2 font-serif text-xl font-bold text-[#f4dfc2]"><FlaskConical size={21} /> LABORATORIO</h2>
          <button type="button" onClick={handleLabToggle} aria-expanded={isLabOpen} aria-controls="laboratorio-gres-content" aria-label={isLabOpen ? 'Cerrar laboratorio' : 'Abrir laboratorio'} className="rounded-lg border border-[#d49758] px-3 py-2 text-sm font-bold text-[#f4dfc2] hover:bg-[#b96542] hover:text-white">
            <span className="accordion-chevron dark-chevron" aria-hidden="true">{isLabOpen ? '▲' : '▼'}</span>
          </button>
        </div>

        {isLabOpen && <div id="laboratorio-gres-content">
        <div className="mb-5 flex flex-wrap gap-2 border-b border-[#b98256]/40 pb-4" role="tablist" aria-label="Secciones del laboratorio">
          {Object.entries(labTabLabels).map(([tab, label]) => <button key={tab} type="button" role="tab" aria-selected={activeLabTab === tab} onClick={() => setActiveLabTab(tab)} className={`rounded-lg px-4 py-2 text-sm font-bold ${activeLabTab === tab ? 'bg-[#b96542] text-white' : 'bg-[#241714] text-[#e1c2a1] hover:bg-[#70402e]'}`}>{label}</button>)}
          <button type="button" onClick={exportLabTrials} disabled={activeLabTrials.length === 0} aria-label="Descargar ensayos en Excel" title="Descargar ensayos en Excel" className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#3b2418] text-[#3b2418] hover:bg-[#b96542] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"><Download size={18} /></button>
        </div>
        <p className="mb-4 text-sm font-semibold text-[#d8b99a]">Registro independiente de {labTabLabels[activeLabTab].toLowerCase()}</p>
        <form onSubmit={handleLabSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label className="text-sm font-semibold text-[#f4dfc2]">Nombre del ensayo
            <input type="text" value={activeLabForm.name} onChange={event => handleLabFieldChange('name', event.target.value)} placeholder={activeLabTab === 'pastas' ? 'Pasta Base 01' : activeLabTab === 'barbotinas' ? 'Barbotina especial' : 'Esmalte alta temperatura'} className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>
          <label className="text-sm font-semibold text-[#f4dfc2]">Fecha de elaboración
            <input type="date" value={activeLabForm.date} onChange={event => handleLabFieldChange('date', event.target.value)} className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>
          <label className="text-sm font-semibold text-[#f4dfc2]">Fecha de resultado
            <input type="date" value={activeLabForm.resultDate} onChange={event => handleLabFieldChange('resultDate', event.target.value)} className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>
          <label className="text-sm font-semibold text-[#f4dfc2]">Agregado por
            <input type="text" value={activeLabForm.addedBy} onChange={event => handleLabFieldChange('addedBy', event.target.value)} placeholder="Ej. Ebal" className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>
          <label className="text-sm font-semibold text-[#f4dfc2] lg:col-span-2">Composición porcentual de la fórmula
            <textarea value={activeLabForm.composition} onChange={event => handleLabFieldChange('composition', event.target.value)} placeholder="Ej. Arcilla 50% · Feldespato 25% · Sílice 20% · Bentonita 5%" rows="3" className="mt-1 w-full resize-y rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>
          {activeLabTab === 'pastas' && <label className="text-sm font-semibold text-[#f4dfc2]">Contracción medida (%)
            <input type="number" min="0" step="0.1" value={activeLabForm.shrinkage} onChange={event => handleLabFieldChange('shrinkage', event.target.value)} placeholder="Ej. 8,5" className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>}
          {activeLabTab === 'barbotinas' && <label className="text-sm font-semibold text-[#f4dfc2]">Densidad (g/ml)
            <input type="number" min="0" step="0.01" value={activeLabForm.density} onChange={event => handleLabFieldChange('density', event.target.value)} placeholder="Ej. 1,75" className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>}
          {activeLabTab === 'esmaltes' && <label className="text-sm font-semibold text-[#f4dfc2]">Temperatura o cono de quema
            <input type="text" value={activeLabForm.firing} onChange={event => handleLabFieldChange('firing', event.target.value)} placeholder="Ej. Cono 6 / 1220 °C" className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>}
          {activeLabTab !== 'esmaltes' && <label className="text-sm font-semibold text-[#f4dfc2]">Temperatura o cono de quema
            <input type="text" value={activeLabForm.firing} onChange={event => handleLabFieldChange('firing', event.target.value)} placeholder="Ej. Cono 6 / 1220 °C" className="mt-1 w-full rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>}
          <label className="text-sm font-semibold text-[#f4dfc2] lg:col-span-2">Observaciones y resultados
            <textarea value={activeLabForm.observations} onChange={event => handleLabFieldChange('observations', event.target.value)} placeholder="Comportamiento, textura, secado, colaje o resultado de quema..." rows="4" className="mt-1 w-full resize-y rounded-lg bg-[#241714] p-3 text-[#f8eee1] outline-none ring-1 ring-[#8d5239] focus:ring-[#d49758]" />
          </label>
          <div className="text-sm font-semibold text-[#f4dfc2]">Foto de la prueba
            <input id="lab-image-file" type="file" accept="image/*" onChange={handleLabImageChange} className="sr-only" />
            <label htmlFor="lab-image-file" className="mt-1 flex cursor-pointer items-center justify-center rounded-lg bg-[#b96542] p-3 text-sm font-semibold text-white hover:bg-[#a95335]">Seleccionar foto</label>
            {activeLabForm.imageName && <span className="mt-1 block text-xs text-[#d8b99a]">Archivo: {activeLabForm.imageName}</span>}
            {!activeLabForm.imageName && <span className="mt-1 block text-xs text-[#d8b99a]">Ningún archivo seleccionado</span>}
          </div>
          <div className="flex gap-3 lg:col-span-2">
            <button type="submit" className="flex-1 rounded-lg bg-[#b96542] p-3 font-bold text-white shadow-md hover:bg-[#a95335]">{editingLabTrialId ? 'Guardar cambios' : `Registrar ${labTabLabels[activeLabTab].toLowerCase()}`}</button>
            {editingLabTrialId && <button type="button" onClick={cancelLabEdit} className="rounded-lg border border-[#b98256] px-4 p-3 font-bold text-[#3b2418] hover:bg-[#d7ad8a]">Cancelar</button>}
          </div>
        </form>

        {activeLabTrials.length > 0 && <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#b98256]/40 pt-5 xl:grid-cols-2">
          {activeLabTrials.map(trial => <article key={trial.id} className="rounded-xl border border-[#b98256] bg-[#ead6b8] p-4 text-[#111111]">
            <div className="flex items-start justify-between gap-3 border-b border-[#b98256]/50 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold">{trial.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-65">Elaboración: {trial.date} · Resultado: {trial.resultDate || 'Pendiente'} · Agregado por: {trial.addedBy || 'Sin registrar'}</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={() => handleLabEdit(trial)} className="rounded-md border border-[#b98256] px-2 py-1 text-xs font-bold hover:bg-[#d7ad8a]">Editar fórmula</button>
                <button type="button" onClick={() => handleLabDelete(trial.id)} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-[#8f2f25] hover:bg-[#d7ad8a]" aria-label={`Eliminar ensayo ${trial.name}`}><Trash2 size={15} /> Eliminar ensayo</button>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="font-bold opacity-70">{activeLabTab === 'barbotinas' ? 'Densidad' : activeLabTab === 'pastas' ? 'Contracción' : 'Quema'}</dt><dd>{activeLabTab === 'barbotinas' ? (trial.density ? `${trial.density} g/ml` : 'Sin medir') : activeLabTab === 'pastas' ? (trial.shrinkage ? `${trial.shrinkage}%` : 'Sin medir') : (trial.firing || 'Sin registrar')}</dd></div>
              <div><dt className="font-bold opacity-70">{activeLabTab === 'esmaltes' ? 'Fórmula' : 'Quema'}</dt><dd>{activeLabTab === 'esmaltes' ? (trial.composition || 'Sin registrar') : (trial.firing || 'Sin registrar')}</dd></div>
            </dl>
            <div className="mt-3 space-y-2 text-sm"><p><strong>Composición:</strong> {trial.composition || 'Sin registrar'}</p><p><strong>Observaciones:</strong> {trial.observations || 'Sin registrar'}</p></div>
            {trial.imageUrl && <img src={trial.imageUrl} alt={`Foto de ${trial.name}`} className="mt-4 max-h-64 w-full rounded-lg border border-[#b98256] object-cover" />}
          </article>)}
        </div>}
        </div>}
      </section>

      {isCalculatorOpen && <section className="artisanal-panel tool-panel order-4 max-w-7xl mx-auto mb-8 w-full rounded-2xl p-5" aria-labelledby="calculadora-taller-title">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="calculadora-taller-title" className="sr-only">Calculadora del taller</h2>
        </div>
        <div id="calculadora-taller-content" className="calculator-shell-wrapper text-[#111111]">
          <div className="calculator-shell">
            <div className="calculator-header">
              <div className="calculator-brand">
                <span className="calculator-led" />
                <span>CALC</span>
              </div>
              <div className="calculator-status">Taller</div>
            </div>

            <div className="calculator-screen">
              <span className="calculator-screen-label">TOTAL</span>
              <strong>{formatCalculatedAmount((Number(calculatorTotal) || 0), calculatorUnit)}</strong>
              <small>{calculatorRows.reduce((sum, row) => sum + (Number(row.percentage) || 0), 0).toFixed(2)}% fórmula</small>
            </div>

            <div className="calculator-form-grid">
              <label className="text-sm font-bold">Fórmula de laboratorio
                <select value={calculatorFormula} onChange={event => handleCalculatorFormulaChange(event.target.value)} className="mt-1 w-full rounded-lg bg-[#f6efe6] p-3 text-[#111111] outline-none ring-1 ring-[#b98256]">
                  <option value="manual">Fórmula manual</option>
                  {calculatorTrials.map(trial => <option key={trial.id} value={trial.id}>{trial.name} ({labTabLabels[trial.type]})</option>)}
                </select>
              </label>
              <label className="text-sm font-bold">Cantidad total
                <input type="number" min="0" step="any" value={calculatorTotal} onChange={event => handleProtectedChange(setCalculatorTotal, event.target.value)} placeholder="Ej. 5" className="mt-1 w-full rounded-lg bg-[#f6efe6] p-3 text-[#111111] outline-none ring-1 ring-[#b98256]" />
              </label>
              <label className="text-sm font-bold">Unidad
                <select value={calculatorUnit} onChange={event => handleProtectedChange(setCalculatorUnit, event.target.value)} className="mt-1 w-full rounded-lg bg-[#f6efe6] p-3 text-[#111111] outline-none ring-1 ring-[#b98256]">
                  <option value="kg">Kilogramos (kg)</option><option value="g">Gramos (g)</option><option value="mg">Miligramos (mg)</option><option value="L">Litros (L)</option><option value="ml">Mililitros (ml)</option>
                </select>
              </label>
            </div>

            <div className="calculator-rows">
              {calculatorRows.map((row, index) => {
                const percentage = Number(row.percentage) || 0;
                const calculated = (Number(calculatorTotal) || 0) * (percentage / 100);
                return <div key={`${index}-${row.ingredient || 'row'}`} className="calculator-row">
                  <input type="text" value={row.ingredient} onChange={event => handleCalculatorRowChange(index, 'ingredient', event.target.value)} placeholder="Ingrediente" className="calculator-input ingredient" />
                  <input type="number" min="0" max="100" step="0.01" value={row.percentage} onChange={event => handleCalculatorRowChange(index, 'percentage', event.target.value)} placeholder="%" className="calculator-input percent" />
                  <div className="calculator-result">{formatCalculatedAmount(calculated, calculatorUnit)}</div>
                  <button type="button" onClick={() => removeCalculatorRow(index)} className="calculator-delete">×</button>
                </div>;
              })}
            </div>

            <div className="calculator-actions">
              <button type="button" onClick={addCalculatorRow} className="calculator-primary">+ Ingrediente</button>
              <button type="button" onClick={() => setCalculatorRows([{ ingredient: '', percentage: '' }])} className="calculator-secondary">Reset</button>
            </div>

            <p className="calculator-note">Porcentaje × cantidad total. Ideal para mezclas, esmaltes y barbotinas.</p>
          </div>
        </div>
      </section>}

      <main key={taller} className="order-1 mx-auto w-full max-w-[1500px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-5 px-0 md:px-2" aria-label={`Inventario y métricas de Taller ${taller}`}>
        {allCategories.map((category) => {
          const categoryStock = category.materials.reduce((total, material) => total + (inventory[`${taller}-${material}`]?.stock || 0), 0);
          const categoryValue = category.materials.reduce((total, material) => {
            const materialInventory = inventory[`${taller}-${material}`];
            return total + (materialInventory?.stock || 0) * (materialInventory?.unitCostBase || 0);
          }, 0);
          const categoryReference = category.materials.length * getMaxStockForCategory(category.name);
          const categoryPercentage = categoryReference > 0 ? Math.round((categoryStock / categoryReference) * 100) : 0;
          const categoryProgress = Math.min(100, Math.max(0, categoryPercentage));
          const lowStockCount = category.materials.filter(material => (inventory[`${taller}-${material}`]?.stock || 0) < minimumStock).length;
          const isCategoryOpen = openCategories.has(category.name);
          return (
            <section key={category.name} className={`artisanal-card ${isCategoryOpen ? 'md:col-span-2 xl:col-span-2' : ''} p-5 rounded-2xl border text-[#f5eadd] ${category.bgClass}`}>
              <button type="button" onClick={() => handleCategoryToggle(category.name)} aria-expanded={isCategoryOpen} aria-controls={`category-${category.name}`} className="flex w-full items-center gap-4 text-left">
                <div className="relative w-16 h-16 shrink-0" role="img" aria-label={`${category.name}: ${categoryPercentage}% de stock`}>
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                    <path className="text-white/20" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="category-ring" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray={`${categoryProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{categoryPercentage}%</span>
                </div>
                <div>
                  <h3 className="font-bold">{category.name}</h3>
                  <p className="text-sm opacity-75">Total: {formatStock(categoryStock, category.name)}</p>
                  <p className="text-sm font-semibold mt-1">Valor disponible: {formatCurrency(categoryValue)}</p>
                  {category.name === gresCategoryName && <p className="text-sm font-semibold">Costo estimado de lotes: {formatCurrency(categoryValue)}</p>}
                  {lowStockCount > 0 && <p className="low-stock-alert flex items-center gap-1 text-sm font-bold mt-1 text-red-700"><AlertTriangle size={14} /> {lowStockCount} bajo mínimo</p>}
                </div>
                <span className="accordion-chevron ml-auto shrink-0 text-lg font-bold" aria-hidden="true">{isCategoryOpen ? '▲' : '▼'}</span>
              </button>
              <button type="button" onClick={() => openMaterialModal(category.name)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#D49758]/70 px-3 py-2 text-sm font-bold text-[#F4DFC2] transition hover:bg-[#C85A32] hover:text-white">
                <Plus size={16} /> Agregar material
              </button>
              {isCategoryOpen && <div id={`category-${category.name}`} className="mt-4 border-t border-current/20 pt-2">
                {category.materials.map(material => {
                  const materialStock = inventory[`${taller}-${material}`]?.stock || 0;
                  const isLowStock = materialStock < minimumStock;
                  const materialPercentage = Math.round((materialStock / getMaxStockForCategory(category.name)) * 100);
                  const materialProgress = Math.min(100, Math.max(0, materialPercentage));
                  const progressColor = materialPercentage > 70 ? 'bg-green-600' : materialPercentage > 30 ? 'bg-yellow-500' : 'bg-red-600';
                  const formulaKey = `${category.name}-${material}`;
                  const isFormulaOpen = openFormula === formulaKey;
                  const formula = formulaDrafts[formulaKey] || getGresFormula(material);
                  return <div key={material} className="py-2 text-sm border-b border-current/10 last:border-0">
                    <div className="grid grid-cols-[1fr_auto] gap-x-3">
                    <div className="min-w-0">
                      <span className="block truncate font-semibold">{material}</span>
                      {category.name === gresCategoryName && <span className="mt-0.5 block truncate text-[11px] opacity-75" title={formula}>Fórmula: {formula}</span>}
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label={`Stock de ${material}`} aria-valuenow={materialProgress} aria-valuemin="0" aria-valuemax="100">
                        <div className={`progress-fill h-full rounded-full ${progressColor}`} style={{ width: `${materialProgress}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold whitespace-nowrap ${isLowStock ? 'flex items-center gap-1 text-red-700' : ''}`}>{isLowStock && <AlertTriangle size={13} />}{category.name === gresCategoryName ? `Volumen: ${formatStock(materialStock, category.name)}` : formatStock(materialStock, category.name)}</span>
                      <button type="button" onClick={() => handleDeleteMaterial(material, category.name)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-red-200 transition hover:bg-red-700 hover:text-white" aria-label={`Eliminar material ${material}`} title="Eliminar material">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    </div>
                    {category.name === gresCategoryName && <>
                      <button type="button" onClick={() => setOpenFormula(isFormulaOpen ? '' : formulaKey)} className="mt-2 text-xs font-bold text-current/70 hover:text-current">
                        {isFormulaOpen ? 'Ocultar fórmula' : 'Ver y editar fórmula'}
                      </button>
                      {isFormulaOpen && <div className="mt-2 rounded-lg bg-white/40 p-2">
                        <textarea value={formula} onChange={e => handleProtectedChange(setFormulaDrafts, { ...formulaDrafts, [formulaKey]: e.target.value })} placeholder="Ej. Feldespato 45% · Sílice 25% · Caolín 20% · Óxido 10%\nQuema: cono 6, atmósfera oxidante" rows="3" className="w-full resize-y rounded-md bg-white/70 p-2 text-xs text-black outline-none placeholder:text-black/50" aria-label={`Fórmula de ${material}`} />
                        <p className="mt-1 text-[11px] opacity-70">Registra porcentajes de insumos secos y notas de temperatura o quema.</p>
                      </div>}
                    </>}
                  </div>;
                })}
              </div>}
            </section>
          );
        })}
      </main>
      <section className="artisanal-panel tool-panel order-2 max-w-7xl mx-auto mt-8 mb-8 w-full rounded-2xl p-5" aria-labelledby="historial-title">
        <div className={`flex items-center justify-between gap-3 ${isHistoryOpen ? 'mb-5 border-b border-[#b98256]/40 pb-4' : ''}`}>
          <h2 id="historial-title" className="flex items-center gap-2 font-serif text-xl font-bold"><Clock size={20} /> HISTORIAL DE MOVIMIENTOS</h2>
          <div className="flex items-center gap-2">
            {isHistoryOpen && <div className="flex flex-wrap gap-2">
              <button type="button" onClick={exportInventory} className="flex items-center gap-2 rounded-lg border border-[#3b2418] px-3 py-2 text-sm font-bold text-[#3b2418] hover:bg-[#b96542] hover:text-white"><Download size={16} /> Exportar inventario</button>
              <button type="button" onClick={exportHistory} className="flex items-center gap-2 rounded-lg border border-[#3b2418] px-3 py-2 text-sm font-bold text-[#3b2418] hover:bg-[#b96542] hover:text-white"><Download size={16} /> Exportar historial</button>
            </div>}
            <button type="button" onClick={handleHistoryToggle} aria-expanded={isHistoryOpen} aria-controls="historial-content" aria-label={isHistoryOpen ? 'Cerrar historial' : 'Abrir historial'} className="rounded-lg border border-[#d49758] px-3 py-2 text-sm font-bold hover:bg-[#b96542] hover:text-white"><span className="accordion-chevron history-chevron" aria-hidden="true">{isHistoryOpen ? '▲' : '▼'}</span></button>
          </div>
        </div>
        {isHistoryOpen && <div id="historial-content">
        {history.length === 0 ? <p className="text-[#5a3827]">Todavía no hay movimientos registrados.</p> : history.map(movement => (
          <div key={movement.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 py-2 text-sm">
            <div>
              <span>{movement.date} {movement.time} | {movement.taller} | {movement.material}</span>
              {(movement.responsible || movement.destination) && <p className="text-[#C9B9AC] mt-1">{movement.responsible && `Responsable: ${movement.responsible}`}{movement.responsible && movement.destination && ' | '}{movement.destination && `Destino: ${movement.destination}`}</p>}
            </div>
            <span className={movement.type === 'entrada' ? 'text-green-400' : 'text-red-400'}>{movement.type === 'entrada' ? '+' : '-'} {movement.amountFormatted}</span>
            <button type="button" onClick={() => handleDeleteMovement(movement.id, movement.taller, movement.material, movement.type, movement.amountVal)} className="text-red-300" aria-label={`Eliminar movimiento de ${movement.material}`}><Trash2 size={16} /></button>
          </div>
        ))}
        </div>}
      </section>
      <button
        type="button"
        onClick={handleCalculatorToggle}
        aria-expanded={isCalculatorOpen}
        aria-controls="calculadora-taller-content"
        aria-label={isCalculatorOpen ? 'Cerrar calculadora' : 'Abrir calculadora'}
        className="calculator-fab order-4 mx-auto mb-3"
        title={isCalculatorOpen ? 'Cerrar calculadora' : 'Abrir calculadora'}
      >
        <Calculator size={20} />
      </button>
      <footer className="order-4 mx-auto mt-8 max-w-7xl pb-4 text-center text-sm font-semibold text-[#F4DFC2]">
        <div className="mx-auto mb-3 h-px w-24 bg-[#D49758]" aria-hidden="true" />
        <p>Oficina Artes del Fuego</p>
        <p className="mt-1">Posadas Misiones 2026</p>
      </footer>
    </div>
  );
}