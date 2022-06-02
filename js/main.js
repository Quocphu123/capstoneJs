/**
 * 1.Fetch dữ liệu từ API => done
 * 2.render dữ liệu
 */

var productList = [];
var productCart = [];
let fetProduct = async () => {
  const res = await axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "GET",
  });
  productList = res.data;
  renderProduct(productList);
};

let renderProduct = (data) => {
  let dataHTML = "";
  data.map((item, index) => {
    let { id, name, img, desc } = item;
    dataHTML += `
            <div class="col-4 mb-3">
                <div class="card h-100 mb-5">
                  <img src=${img} alt="#" class="mt-3"/>
                  <div class="card-body">
                      <h5 class="card-title">${name}</h5>
                      <p class="card-text">
                        ${desc}
                      </p>
                      <button href="#" onclick="addCart('${id}')" class="btn btn-success w-100">Add To Cart</button>
                  </div>
                </div>
            </div>
        `;
  });
  document.getElementById("renderProduct").innerHTML = dataHTML;
};
fetProduct();

let selectType = () => {
  let selectedArray = [];
  var selectValue = document
    .getElementById("mySelect")
    .value.toUpperCase()
    .trim();
  // for (let i = 0; i < productList.length; i++) {
  //   if (productList[i].type.toUpperCase() === selectValue) {
  //     selectedArray.push(productList[i]);
  //     console.log(selectedArray);
  //     renderProduct(selectedArray);
  //   } else {

  //     renderProduct(productList);
  //   }
  // }
  const productType = productList.filter(
    (product) => product.type.toUpperCase().trim() == selectValue
  );
  if (!productType.length ) {
    renderProduct(productList);
  }  else {
    renderProduct(productType)
  }
    
};

let renderCart = (data) => {
  if (data) {
    productCart = data;
  }
  let dataHTML = "";
  let totalHTML = "";
  let total = 0;
  productCart.map((item) => {
    let { id, img, name, price, quantity } = item;
    total += price * quantity;
    dataHTML += `
      <tr>
        <td><img src=${img} width="80px" alt="#" /></td>
        <td>${name}</td>
        <td>${formatCash(price)}</td>
        <td>
          ${quantity}
          <button class="btn btn-info" onclick="decreaseQuantity('${id}')">-</button>
          <button class="btn btn-info" onclick="increaseQuantity('${id}' )">+</button>
        </td>
        <td>${formatCash(price * quantity + "")}</td>
        <td><button onclick="deleteCart('${id}')" class="btn btn-info">x</button></td>
      </tr>
    `;
    totalHTML = `
      <h3>Tổng Tiền</h3>
      <h3 class="mx-5">${formatCash(total + "")}</h3>
      <button class="btn btn-info" onclick="payment()">Thanh Toán</button>
    `;
  });
  document.getElementById("tbodyCart").innerHTML = dataHTML;
  document.getElementById("renderTotal").innerHTML = totalHTML;
};
const deleteCart = (id) => {
  const product = productCart.filter((product) => product.id !== id);
  renderCart(product);
  saveLocalStorgeCart();
};
let increaseQuantity = (itemId) => {
  const product = productList.find((item) => item.id === itemId);
  for (let item of productCart) {
    if (item.id == itemId) {
      if (item.quantity >= product.quantity) {
        alert("Sản phẩm có số lượng k đủ!!!");
        return;
      }
      item.quantity++;
    }
  }
  renderCart();
  saveLocalStorgeCart();
};

const payment = () => {
  productCart = [];
  renderCart();
};

let decreaseQuantity = (itemId) => {
  for (let item of productCart) {
    if (item.id == itemId) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        deleteInCart(itemId);
      }
    }
  }
  renderCart();
  saveLocalStorgeCart();
};

const deleteInCart = (id) => {
  const index = productCart.findIndex((item, index) => {
    if (item.id == id) {
      return index;
    }
  });
  if (confirm("Bạn muốn xóa sản phẩm khỏi giỏ hàng k?")) {
    productCart.splice(index, 1);
  }
  renderCart();
  saveLocalStorgeCart();
};

let addCart = (id) => {
  let product = productList.find((item) => item.id == id);

  // Kiểm tra productCart có item nào k
  const index = productCart.find((item) => item.id == product.id);
  // Tìm k thấy sản phẩm trong productCart => thêm sản phêm mới
  if (!index) {
    product = { ...product, quantity: 1 };
    productCart.push(product);
  }
  // Nếu có thì tăng  quantity++
  else {
    index.quantity++;
  }
  saveLocalStorgeCart();
  getLocalStorgeCart();
};

const formatCash = (str) => {
  str = str.split("").reverse();
  let result = "";
  for (let index in str) {
    if (index % 3 === 0 && index != 0) {
      result += ",";
    }
    result += str[index];
  }

  return result.split("").reverse().join("");
};

const saveLocalStorgeCart = () => {
  localStorage.setItem("phoneCart", JSON.stringify(productCart));
};

const getLocalStorgeCart = () => {
  const cartFromLocal = JSON.parse(localStorage.getItem("phoneCart"));
  renderCart(cartFromLocal);
};

getLocalStorgeCart();
