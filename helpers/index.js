export const mutationArrayToNamespacedObject = (array, namespace) =>
  array.reduce((object, type) => {
    object[type] = `${namespace}/${type}`;
    return object;
  }, {});
