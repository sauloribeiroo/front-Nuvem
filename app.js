const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');

// Referências aos novos elementos do formulário de UPDATE no HTML
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');

// --- READ (Lê todos os produtos) ---
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();

  // Limpa a lista de produtos
  productList.innerHTML = '';

  // Adiciona cada produto à lista
  products.forEach(product => {
    const li = document.createElement('li');
    // Formata o preço para duas casas decimais, caso seja necessário
    const formattedPrice = parseFloat(product.price).toFixed(2); 
    li.innerHTML = `${product.name} - R$${formattedPrice}`;

    // Adiciona botão DELETE
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts(); // Recarrega a lista
    });
    li.appendChild(deleteButton);

    // Adiciona botão UPDATE (preenche o formulário de atualização)
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      // Preenche o formulário de atualização com os dados do produto
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// --- CREATE (Adiciona um novo produto) ---
async function addProduct(name, price) {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price })
  });
  return response.json();
}

// Event listener para o formulário de Adicionar Produto
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  // Converte a string do preço para um número decimal (float) antes de enviar
  const price = parseFloat(addProductForm.elements['price'].value); 
  
  await addProduct(name, price);
  addProductForm.reset();
  await fetchProducts(); // Recarrega a lista após adicionar
});

// --- UPDATE (Atualiza um produto existente) ---
// Função NOVA: Envia o ID e os novos dados via método PUT
async function updateProduct(id, name, price) {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price }) // Envia o nome e preço atualizados
  });
  return response.json();
}

// Event listener para o formulário de Atualizar Produto (NOVO)
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  
  // Captura os valores atuais dos inputs de atualização
  const id = updateProductId.value; 
  const name = updateProductName.value;
  // Converte o preço para número decimal (float)
  const price = parseFloat(updateProductPrice.value);
  
  // Verifica se o ID está presente (se o formulário foi preenchido corretamente)
  if (!id) {
    alert("Nenhum produto selecionado para atualização!");
    return;
  }

  await updateProduct(id, name, price);
  updateProductForm.reset(); // Limpa o formulário após a submissão
  await fetchProducts(); // Recarrega a lista para mostrar a mudança
});


// --- DELETE (Remove um produto) ---
async function deleteProduct(id) {
  const response = await fetch('http://localhost:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response.json();
}

// Fetch all products on page load (Inicia a aplicação lendo os dados)
fetchProducts();