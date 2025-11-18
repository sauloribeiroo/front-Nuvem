const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');

const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
const updateProductPrice = document.querySelector('#update-price');

// --- READ ---
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();

  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    const formattedPrice = parseFloat(product.price).toFixed(2); 
    
    const infoSpan = document.createElement('span');
    infoSpan.innerHTML = `
      <strong>${product.name}</strong><br>
      ${product.description}<br>
      R$${formattedPrice}
    `;
    li.appendChild(infoSpan); 

    const buttonContainer = document.createElement('div'); 

    // DELETE
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts(); 
    });
    buttonContainer.appendChild(deleteButton);

    // UPDATE
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductDescription.value = product.description;
      updateProductPrice.value = product.price;

      updateProductForm.style.display = 'block';
      updateProductName.focus();
    });
    buttonContainer.appendChild(updateButton);
    
    li.appendChild(buttonContainer); 
    productList.appendChild(li);
  });
}

// --- CREATE ---
async function addProduct(name, description, price) {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
  return response.json();
}

addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  
  const name = addProductForm.elements['name'].value;
  const description = addProductForm.elements['description'].value;
  const price = parseFloat(addProductForm.elements['price'].value);
  
  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

// --- UPDATE ---
async function updateProduct(id, name, description, price) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
  return response.json();
}

updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  
  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = parseFloat(updateProductPrice.value);
  
  await updateProduct(id, name, description, price);
  
  updateProductForm.reset();
  updateProductForm.style.display = 'none';
  
  await fetchProducts();
});

// --- DELETE ---
async function deleteProduct(id) {
  const response = await fetch('http://localhost:3000/products/' + id, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

updateProductForm.style.display = 'none';
fetchProducts();
