export const protectedBaseMaterialKeys = new Set(['ARCILLAS-YESO']);

export const isProtectedBaseMaterial = (materialKey) => protectedBaseMaterialKeys.has(materialKey);

export const buildAvailableMaterials = (categoryList = [], deletedBaseMaterials = [], customMaterials = []) =>
  categoryList.map(category => ({
    ...category,
    materials: [
      ...category.materials.filter(material => {
        const materialKey = `${category.name}-${material}`;
        return !deletedBaseMaterials.includes(materialKey) || isProtectedBaseMaterial(materialKey);
      }),
      ...customMaterials
        .filter(material => material.categoryName === category.name)
        .map(material => material.name)
    ]
  }));
