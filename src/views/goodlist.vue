<template>
  <div>
    <navHeader></navHeader>
    <navBread>
      <span>Goods</span>
    </navBread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}">
              <use xlink:href="#icon-arrow-short" />
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter()">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" :class="{'cur':pricechecked=='all'}">All</a>
              </dd>
              <dd v-for="(item,key) in priceFilter">
                <a
                  href="javascript:void(0)"
                  :class="{'cur':pricechecked==key}"
                  @click="setPriceFilter(key)"
                >{{item.startPrice}}-{{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,key) in goodlist">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'static/img/'+item.productImage" alt />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">￥{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                 <img src="static\loading\loading-spinning-bubbles.svg" alt="" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overlayFlag" @click="close"></div>
    <modal v-bind:mdShow="mdShow" @close="closeModal">
        <p slot="message">
          请先登录，否则无法加入到购物车
        </p>
        <div slot="inp">
          <a class="btn btn--m" @click="mdShow=false">关闭</a>
        </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" @close="closeModal">
        <p slot="message">

            <svg class="icon-status-ok">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" />
              </svg>
              <span>加入购物车成功!</span>
        </p>
        <div slot="inp">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
          <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
    </modal>
    <navFooter></navFooter>
    
  </div>
</template>

<script>
import navHeader from "./header";
import navFooter from "./footer";
import navBread from "./bread";
import modal from "./modal"
import axios from "axios";
export default {
  components: {
    navHeader,
    navFooter,
    navBread,
    modal
  },
  data() {
    return {
      goodlist: [],
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      pricechecked: "all",
      filterBy: false,
      overlayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy:true,
      loading:false,
      mdShow:false,
      mdShowCart:false
    };
  },
  mounted() {
    this.getGoodslist();
  },
  methods: {
    getGoodslist(flag) {
      var param = {
        //参数
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel:this.priceChecked
      };
      this.loading=true
      axios.get("/goods/list", {
          params: param
        })
        .then(response => {
          let res = response.data;
           this.loading=false;
          if (res.status == "0") {
            if(flag){
              this.goodlist=this.goodlist.concat(res.result.list)
              if(res.result.count==0){
                 this.busy =true
              }else{
                this.busy =false;
              }
            }else{
               this.goodlist=res.result.list
               this.busy =false;
            }
          } else {
            this.goodlist = [];
          }
        });
    },
    showFilter() {
      this.filterBy = true;
      this.overlayFlag = true;
    },
    close() {
      this.filterBy = false;
      this.overlayFlag = false;
    },
    sortGoods() {
      //排序/升降
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodslist();
    },
    setPriceFilter(key){
      this.pricechecked =key;
      this.page=1;
      this.getGoodslist();
      this.close();
    },
    loadMore(){//鼠标滚动
      this.busy=true;
      setTimeout(() => {
        this.page++;
        this.getGoodslist(true)
      }, 1000)
    },
    addCart(productId){
      
      axios.post("/goods/addCart",{
        productId:productId
      }).then((res)=>{
        console.log(res)
        if(res.data.status==0){
          this.mdShowCart=true
        }else{
          this.mdShow=true
        }
      })
    },
    closeModal(){
      this.mdShow=false;
    }
  }
};
</script>
<style  scoped>
.load{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.sort-up{
  transform:rotate(180deg);
  transition:all .3s ease-out;
}
.btn:hover{
  background: #ffe5e6;
  transition: all .3s ease-out;
}
</style>

