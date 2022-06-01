let dataList = [];
const fetchProductData = async () => {
  const res = await axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "GET",
  });
  dataList = res.data;

  renderProduct();
};

const renderProduct = (data) => {
  if (!data) data = dataList;
  let dataHTML = "";
  data.map((item) => {
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
  document.getElementById("phoneName").value = name;
  document.getElementById("backCamera").value = backCamera;
  document.getElementById("frontCamera").value = frontCamera;
  document.getElementById("price").value = price;
  document.getElementById("screen").value = screen;
  document.getElementById("image").value = img;
  document.getElementById("desc").value = desc;
  document.getElementById("branch").value = type;
  document.getElementById("quantity").value = quantity;

  if (!document.getElementById("btnSaveProduct")) {
    document.getElementById("btnAddProduct").style.display = "none";
    const btnSave = document.createElement("button");
    btnSave.id = "btnSaveProduct";
    btnSave.innerHTML = "Lưu sản phẩm";
    btnSave.className = "btn btn-primary";
    document.querySelector(".modal-footer").appendChild(btnSave);
    btnSave.addEventListener("click", () => updateProduct(foundProduct.id));
  } else {
    document.getElementById("btnSaveProduct").remove();
    const btnSave = document.createElement("button");
    btnSave.id = "btnSaveProduct";
    btnSave.innerHTML = "Lưu sản phẩm";
    btnSave.className = "btn btn-primary";
    document.querySelector(".modal-footer").appendChild(btnSave);
    btnSave.addEventListener("click", () => updateProduct(foundProduct.id));
  }
};

const updateProduct = async (id) => {
  if (!checkValid()) return;
  let name = document.getElementById("phoneName").value;
  let price = document.getElementById("price").value;
  let screen = document.getElementById("screen").value;
  let backCamera = document.getElementById("backCamera").value;
  let frontCamera = document.getElementById("frontCamera").value;
  let desc = document.getElementById("desc").value;
  let image = document.getElementById("image").value;
  let type = document.getElementById("branch").value;
  let quantity = document.getElementById("quantity").value;

  var newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    desc,
    image,
    type,
    quantity
  );

  try {
    await axios({
      url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
      method: "PUT",
      data: newProduct,
    });
    document.getElementById("btnResetModal").click();
    document.getElementById("btnCloseModal").click();
  } catch (err) {
    console.log(err);
  }
  fetchProductData();
};

const createProduct = async () => {
  if (!checkValid()) return;
  let name = document.getElementById("phoneName").value;
  let price = document.getElementById("price").value;
  let screen = document.getElementById("screen").value;
  let backCamera = document.getElementById("backCamera").value;
  let frontCamera = document.getElementById("frontCamera").value;
  let desc = document.getElementById("desc").value;
  let image = document.getElementById("image").value;
  let type = document.getElementById("branch").value;
  let quantity = document.getElementById("quantity").value;

  var newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    desc,
    image,
    type,
    quantity
  );
  console.log(newProduct);
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

const checkValid = () => {
  let isValid = true;

  isValid &=
    require("phoneName", "spanPhoneName") &&
    checkLength("phoneName", "spanPhoneName") &&
    checkPattern(
      /^[A-z0-9\s]+$/g,
      "phoneName",
      "spanPhoneName",
      "* Không nhập ký tự đặc biệt"
    );
  isValid &=
    require("price", "spanPrice") && checkNum("price", "spanPrice", 100000);

  isValid &= require("screen", "spanScreen");

  isValid &= require("backCamera", "spanBackCamera");

  isValid &= require("frontCamera", "frontCamera");

  isValid &= require("image", "spanImage");

  isValid &= require("branch", "spanBranch");

  isValid &=
    require("quantity", "spanQuantity") &&
    checkNum("quantity", "spanQuantity", 1);

  return isValid;
};

const require = (inputId, spanId) => {
  const inputValue = document.getElementById(inputId).value;
  if (inputValue) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(
    spanId
  ).innerHTML = `* Trường này không được để trống `;

  return false;
};

const checkLength = (inputId, spanId, maxLength = 40, minLength = 4) => {
  const inputValue = document.getElementById(inputId).value.split("");
  if (inputValue.length > maxLength || inputValue.length < minLength) {
    document.getElementById(
      spanId
    ).innerHTML = `* Nhập độ dài từ ${minLength} đến ${maxLength} ký tự`;
    return false;
  }
  document.getElementById(spanId).innerHTML = ``;
  return true;
};

const checkPattern = (regex, inputId, spanId, errorMessage) => {
  const inputValue = document.getElementById(inputId).value;
  const valid = regex.test(inputValue);
  if (!valid) {
    document.getElementById(spanId).innerHTML = errorMessage;
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  document.getElementById(spanId).style.display = "none";
  return true;
};

const checkNum = (inputId, spanId, minPrice) => {
  const inputValue = +document.getElementById(inputId).value;
  if (inputValue < minPrice) {
    document.getElementById(
      spanId
    ).innerHTML = `* Giá trị nhỏ nhất là ${formatCash(minPrice + "")}`;
    return false;
  }
  return true;
};

// const searchProduct = () => {
//   const keyword = document
//     .getElementById("inputSearch")
//     .value.toLowerCase()
//     .trim();
//   const arraySearch = dataList.filter((item) => {
//     item.name.toLowerCase().includes(keyword);
//   });

//   // renderProduct(
//   //   dataList.filter((item) =>
//   //     item.name.toLowerCase().includes(value.toLowerCase().trim())
//   //   )
//   // );
// };

const searchProduct = (value) => {
  const arraySearch = dataList.filter((item) =>
    item.name.toLowerCase().includes(value)
  );
  renderProduct(arraySearch);
};

const searchElement = document.getElementById("inputSearch");
searchElement.addEventListener("input", () =>
  searchProduct(searchElement.value.toLowerCase().trim())
);

// const searchElement = document.getElementById("inputSearch");
// searchElement.addEventListener("input", () =>
//   renderProduct(searchElement.value)
// );

fetchProductData();
