//menu
const open = document.getElementById("open");
const overlay = document.querySelector(".overlay");
const close = document.getElementById("close");

//shopping
const addBtns = document.querySelectorAll(".add_cart");

const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal_container");

open.addEventListener("click", () => {
  overlay.classList.add("show");
});

close.addEventListener("click", () => {
  overlay.classList.remove("show");
});

//content of the modal
const closes = document.querySelectorAll(".closes");

closes.forEach((close) => {
  close.addEventListener("click", () => {
    modal.classList.remove("show_modal");
    modalBody.classList.remove("show_modal_container");
  });
});

//Add cart------------------------------------------------------------

let products = [
  {
    name: "Sugee Oat Meal",
    price: 15,
    inCart: 0,
    tag: "sugee.png",
  },
  {
    name: "Yabee Oat Meal",
    price: 10,
    inCart: 0,
    tag: "yabee.jpg",
  },
  {
    name: "Umee Oat Meal",
    price: 20,
    inCart: 0,
    tag: "umee.png",
  },
];

for (let i = 0; i < addBtns.length; i++) {
  addBtns[i].addEventListener("click", () => {
    modal.classList.add("show_modal");
    modalBody.classList.add("show_modal_container");

    //itemをクリックした数ぶんcartNumbersが呼ばれる, 引数にproductsの配列を渡すことでクリックされた商品がわかる
    cartNumbers(products[i]);
    // cancelItem(products[i]);
    totalCost(products[i]);
  });
}

//ページをリフレッシュしてもカートの数字を保存する
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");

  if (productNumbers) {
    document.querySelector(".cartIcon_amount").textContent = productNumbers;
  }
}

function cartNumbers(product) {
  //products[i]のクリックされた[i]に対する関数
  // console.log("the product clicked", product);

  //データを取得
  let productNumbers = localStorage.getItem("cartNumbers");
  // console.log(productNumbers);
  // console.log(typeof productNumbers); -> returned by string

  //文字列からintに変換する
  productNumbers = parseInt(productNumbers);

  //データを保存
  //if: productNumbersが存在していたら,localStrogeの数とカートの数を増やす
  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cartIcon_amount").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cartIcon_amount").textContent = 1;
  }

  //setItemという関数にそのままproductを渡す
  setItems(product);
}

//どのアイテムをクリックしたか判断していく
function setItems(product) {
  //Cartに入ったproductを取得する(これがないと他のボタンを押しても更新がされない),JSON形式で表示されるので、JavaScirptに変える
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  //inCartの数字を足していくよ
  if (cartItems != null) {
    //各々のproductを検知していく(↓がなければ、1度目にクリックされた商品以外はされないので)
    if (cartItems[product.name] == undefined) {
      //undefinedだったらcartItemsを分割していく
      cartItems = {
        ...cartItems,
        [product.name]: product,
      };
    }

    cartItems[product.name].inCart += 1;
  } else {
    //nullだった時なので、一番最初にクリックした時
    product.inCart = 1;
    //カートの中に入ったアイテムをオブジェクトで作る-> localStarageに渡すには、JavaScriptではなくJSONデータに変換する必要がある
    cartItems = {
      [product.name]: product,
    };
  }

  //cartの中に入ったproductをlocalStrageに保存する
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
  console.log(product.price);
  let cartCost = localStorage.getItem("totalCost");

  // console.log("MY CARTCOST IS", cartCost);
  // console.log(typeof cartCost);

  if (cartCost != null) {
    //typeが文字列だったので数字になおす
    cartCost = parseInt(cartCost);
    //setItemすると、localStrageのApplicationに保存されるよ、お決まり文句みたいな形
    localStorage.setItem("totalCost", product.price + cartCost);
  } else {
    //setItemすると、localStrageのApplicationに保存されるよ、お決まり文句みたいな形
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  //localStrageからの情報を持ってくる。その時にはJSON形式からJS形式に変換する

  let cartCost = localStorage.getItem("totalCost");

  cartItems = JSON.parse(cartItems);

  let productContainer = document.querySelector(".products");
  //もしcartItemsかつこのページがexsistしていたら

  // console.log(cartItems);
  if (cartItems && productContainer) {
    //initially empty
    productContainer.innerHTML = "";

    //取得したオブジェクト達(カートに入っている内容)
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
      <div class="products">
        <span class="material-symbols-outlined cancel">
         cancel
        </span>
        <img src="./imgs/${item.tag}">
        <span class="product_name">${item.name}</span>
   
      <div class="product_price">$${item.price}</div>
      <div class="product_quantity"> 
        <span class="minus">-</span>
        <span class="amount_num">${item.inCart}</span>
        <span class="plus">+</span>
      </div>
      <div class="total">
      $${item.inCart * item.price},00</div>
      </div>
      </div>
      `;
    });

    productContainer.innerHTML += `
    <div class="basketTotalContainer">
      <h4 class="basketTotalTitle">
        Basket Total
      </h4>
      <h4 class="basketTotal">
        $${cartCost},00
      </h4>
    </div>`;
  }

  return {
    cartCost,
  };
}

console.log(displayCart().cartCost);

//Local Stargeに保存された情報をカートの表示にも保存させる(1回呼び出されないとinvokeされないので、下の方に関数呼び出す)
onLoadCartNumbers();
//ページをリロードした時、wheneverこのfunctionを呼びたい
displayCart();

//Cancel
const cancels = document.querySelectorAll(".cancel");
for (let i = 0; i < cancels.length; i++) {
  const cancelBtn = cancels[i];
  cancelBtn.addEventListener("click", cancelItems);
}

function cancelItems(e) {
  console.log(e.target);
  const targetItem = e.target;
  targetItem.parentNode.remove();

  const targetTotal =
    targetItem.nextSibling.nextSibling.nextSibling.nextElementSibling
      .nextElementSibling.nextElementSibling.nextElementSibling;
  console.log(displayCart().cartCost);
}

//plus and minus items
const minus = document.querySelectorAll(".minus");
function selectQuantity(item) {
  document.querySelectorAll(".plus").forEach((plus) => {
    plus.addEventListener("click", () => {
      amount_num.text++;
    });
  });

  document.querySelectorAll(".minus").forEach((minus) => {
    minus.addEventListener("click", () => {
      // amount_num.inCart--;
    });
  });
}

selectQuantity();
