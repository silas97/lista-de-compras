const { createApp, ref, computed, watch } = Vue;

const STORAGE_KEY = 'itens';

createApp({
    setup() {
        const products = ref(
            JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
        );

        const productForm = ref({
            id: null,
            name: '',
            quantity: '',
            price: '',
        });

        const searchText = ref('');

        const sortColumn = ref(localStorage.getItem('sortColumn') || '');

        const sortDirection = ref(
            localStorage.getItem('sortDirection') || ''
        );

        const filteredProducts = computed(() => {
            const lowercaseFilter = searchText.value.toLowerCase();
            return products.value
                .filter((item) =>
                    item.name.toLowerCase().startsWith(lowercaseFilter)
                )
                .sort((a, b) => {
                    if (sortColumn.value === 'name') {
                        return (
                            a.name.localeCompare(b.name) *
                            (sortDirection.value === 'asc' ? 1 : -1)
                        );
                    } else if (sortColumn.value === 'quantity') {
                        return (
                            (a.quantity - b.quantity) *
                            (sortDirection.value === 'asc' ? 1 : -1)
                        );
                    } else if (sortColumn.value === 'price') {
                        return (
                            (a.price - b.price) *
                            (sortDirection.value === 'asc' ? 1 : -1)
                        );
                    } else if (sortColumn.value === 'total') {
                        return (
                            (a.quantity * a.price - b.quantity * b.price) *
                            (sortDirection.value === 'asc' ? 1 : -1)
                        );
                    } else if (sortColumn.value === 'id') {
                        return (
                            (a.id - b.id) * (sortDirection.value === 'asc' ? 1 : -1)
                        );
                    } else {
                        return a.id - b.id;
                    }
                });
        });

        const sortBy = (column) => {
            if (sortColumn.value === column) {
                sortDirection.value =
                    sortDirection.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn.value = column;
                sortDirection.value = 'asc';
            }
        };

        const sortTotal = () => {
            sortBy('total');
        };

        const updateProductName = (product, event) => {
            product.name = event.target.textContent;
            saveProductsToLocalStorage();
        };

        const updateProductQuantity = (product, event) => {
            const quantity =
                parseInt(event.target.textContent.replace(/[^\d]/g, '')) || 0;
            product.quantity = quantity;
            saveProductsToLocalStorage();
        };

        const updateProductPrice = (product, event) => {
            const price =
                parseFloat(
                    event.target.textContent
                        .replace(/[^\d.,]/g, '')
                        .replace(',', '.')
                ) || 0;
            product.price = price;
            saveProductsToLocalStorage();
        };

        const deleteProduct = (product) => {
            const index = products.value.findIndex(
                (item) => item.id === product.id
            );
            if (index !== -1) {
                products.value.splice(index, 1);
                saveProductsToLocalStorage();
            }
        };

        const saveProduct = () => {
            if (
                !productForm.value.name ||
                !productForm.value.quantity ||
                !productForm.value.price
            ) {
                return;
            }

            if (productForm.value.id) {
                updateProduct();
            } else {
                createProduct();
            }

            productForm.value = { id: null, name: '', quantity: '', price: '' };
            const productNameInput = document.getElementById("productNameInput");
            productNameInput.focus();
        };

        const createProduct = () => {
            const newItem = { ...productForm.value, id: generateId() };
            products.value.push(newItem);
            saveProductsToLocalStorage();
        };

        const updateProduct = () => {
            const product = products.value.find(
                (item) => item.id === productForm.value.id
            );
            if (product) {
                Object.assign(product, productForm.value);
                saveProductsToLocalStorage();
            }
        };

        const generateId = () => {
            const ids = products.value.map((item) => item.id);
            const maxId = Math.max(...ids);
            return maxId !== -Infinity ? maxId + 1 : 1;
        };

        const saveProductsToLocalStorage = () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value));
        };

        const totalQuantity = computed(() => {
            return filteredProducts.value.reduce(
                (total, item) => total + item.quantity,
                0
            );
        });

        const totalSum = computed(() => {
            return filteredProducts.value
                .reduce((total, item) => total + item.quantity * item.price, 0)
                .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        });

        watch([sortColumn, sortDirection], () => {
            localStorage.setItem('sortColumn', sortColumn.value);
            localStorage.setItem('sortDirection', sortDirection.value);
        });

        return {
            products,
            productForm,
            searchText,
            filteredProducts,
            sortColumn,
            sortDirection,
            sortBy,
            sortTotal,
            updateProductName,
            updateProductQuantity,
            updateProductPrice,
            deleteProduct,
            saveProduct,
            totalQuantity,
            totalSum,
        };
    },
}).mount('#app');