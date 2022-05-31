let productList = [];
let dataList = []
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
            <button class="btn btn-success">CẬP NHẬT</button>
            <button type="button" class="btn btn-danger">XOÁ</button>
            </td>
        </tr>
    `;
  });
  document.getElementById("tableDanhSach").innerHTML = dataHTML;
};

const createProduct = () => {
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
  productList.push(newProduct);
  addProduct(productList)
};

const addProduct = (productList) => {
    try {
         axios({
            url: " https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
            method:"POST",
            data:productList
        })
    }
    catch(err) {
        console.log(err);
    }
    fetchProductData();
}

fetchProductData();
