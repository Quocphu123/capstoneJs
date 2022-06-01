let productList = [];
let dataList = [];
const fetchProductData = async () => {
  const res = await axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "GET",
  });
  dataList = res.data;
  renderProduct();
};

const renderProduct = () => {
  let dataHTML = "";
  dataList.map((item) => {
    let { id, name, screen, backCamera, frontCamera, price, type, quantity } =
      item;
    dataHTML += `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${screen}</td>
            <td>${backCamera}</td>
            <td>${frontCamera}</td>
            <td>${price}</td>
            <td>${type}</td>
            <td>${quantity}</td>
            <td>
            <button data-bs-toggle="modal" data-bs-target="#phoneModal" class="btn btn-success" onclick="getProduct(${id})">CẬP NHẬT</button>
            <button type="button" class="btn btn-danger" onclick="deleteProduct(${id})">XOÁ</button>
            </td>
        </tr>
    `;
  });
  document.getElementById("tableDanhSach").innerHTML = dataHTML;
};

const getProduct = (id) => {
  const foundProduct = findProductById(id);
  let {
    name,
    backCamera,
    frontCamera,
    price,
    screen,
    img,
    desc,
    type,
    quantity,
  } = foundProduct;

  document.getElementById("phoneModal").value = name
  document.getElementById("backCamera").value = backCamera;
  document.getElementById("frontCamera").value = frontCamera;
  document.getElementById("price").value = price;
  document.getElementById("screen").value = screen;
  document.getElementById("image").value = img;
  document.getElementById("desc").value = desc;
  document.getElementById("branch").value = type;
  document.getElementById("quantity").value = quantity;
};

const createProduct = async () => {
  let name = document.getElementById("phoneName").value;
  let price = document.getElementById("price").value;
  let screen = document.getElementById("screen").value;
  let backCamera = document.getElementById("backCamera").value;
  let frontCamera = document.getElementById("frontCamera").value;
  let desc = document.getElementById("desc").value;
  let image = document.getElementById("image").value;
  let branch = document.getElementById("branch").value;
  let quantity = document.getElementById("quantity").value;

  var newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    desc,
    image,
    branch,
    quantity
  );

  try {
    await axios({
      url: " https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
      method: "POST",
      data: newProduct,
    });
    fetchProductData();
    document.getElementById("btnCloseModal").click();
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (id) => {
  const product = findProductById(id);
  if (confirm(`Bạn có muốn xóa sản phẩm này: ${product.name}`)) {
    try {
      await axios({
        url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
        method: "DELETE",
      });
      fetchProductData();
    } catch (err) {
      console.log(err);
    }
  }
};

const findProductById = (id) => {
  return dataList.find((item) => {
    return item.id == id;
  });
};

fetchProductData();
