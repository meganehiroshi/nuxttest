<template>
  <section style="max-width:1140px;margin:0 auto;">
    <b-container>
      <!-- bootstrap のためしstart　  -->
      <h1 class="h1">ssお知らせノート　管理画面</h1>
      <b-row style="margin-bottom:30px;">
        <b-button
          variant="primary"
          v-b-modal="'itemModal'"
        >
          記事を追加する
        </b-button>

        <b-modal id="itemModal"
          @hidden="resetModal"
          @ok="handleOk"
          ref="modal"
          scrollable
        >

          <template v-slot:modal-header="{ close }">
            <!-- Emulate built in modal header close button action -->
            <b-button size="sm" variant="danger"
              v-if="item.id != ''"
              @click="deleteItem">
              記事を削除する
            </b-button>
          </template>
          <form ref="form" @submit.stop.prevent="createNewItem">
            <b-form-group
              :state="itemState.id"
              label="item.id"
              label-for="id-input"
              invalid-feedback="id is required"
              style="display:none"
            >
              <b-form-input
                disabled
                id="id-input"
                v-model="item.id"
                :state="itemState.id"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              :state="itemState.startDate"
              label="表示開始日"
              label-for="startDate-input"
              invalid-feedback="startDate is required"
            >
              <b-form-input
                id="startDate-input"
                v-model="item.startDate"
                :state="itemState.startDate"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              :state="itemState.endDate"
              label="表示終了日"
              label-for="endDate-input"
              invalid-feedback="endDate is required"
            >
              <b-form-input
                id="endDate-input"
                v-model="item.endDate"
                :state="itemState.endDate"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              :state="itemState.title"
              label="item.title"
              label-for="title-input"
              invalid-feedback="title is required"
            >
              <b-form-input
                id="title-input"
                v-model="item.title"
                :state="itemState.title"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              :state="itemState.description"
              label="item.description"
              label-for="description-input"
              invalid-feedback="description is required"
            >
              <b-form-textarea
                id="description-input"
                v-model="item.description"
                :state="itemState.description"
                required
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>

            <b-form-group
              :state="itemState.linkUrl"
              label="item.linkUrl"
              label-for="linkUrl-input"
              invalid-feedback="linkUrl is required"
            >
              <b-form-input
                id="linkUrl-input"
                v-model="item.linkUrl"
                :state="itemState.linkUrl"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              :state="itemState.imgUrl"
              label="item.imgUrl"
              label-for="imgUrl-input"
              invalid-feedback="imgUrl is required"
            >
              <b-form-input
                id="imgUrl-input"
                v-model="item.imgUrl"
                :state="itemState.imgUrl"
                required
              ></b-form-input>
            </b-form-group>
          </form>
        </b-modal>
      </b-row>
      <b-row>
        <b-table
          sticky-header
          ref="selectableTable"
          responsive
          selectable
          @row-selected="onRowSelected"

          v-b-modal="'itemModal'"
          :items="items"
          >

          <!-- <template v-slot:cell(imgUrl)="data">
            <img :src="data.item.imgUrl" style="width:100px"/>
          </template> -->
          <template v-slot:row-details="row">
            <b-card>
              {{row}}
              <img :src="row.item.imgUrl" style="width:100px"/>
            </b-card>
          </template>



        </b-table>
        <ul id="example-1"
        v-on:click="onListSelected" >
          <li v-for="item in items"

          >
            <div class="mt-4">

              <b-card :img-src='item.imgUrl'
              img-thumbnail fluid
              img-alt="Card image" img-left class="mb-3">
                <h4>{{item.title}}</h4>
                <b-card-text>
                  {{item.description}}
                </b-card-text>
              </b-card>
            </div>

          </li>
        </ul>

        <b-modal
          @hidden="clearSelected"
          id="row2">
            Selected Rows:<br>
          {{ selected }}
        </b-modal>
      </b-row>
    </b-container>
    <!-- bootstrap のためしend　  -->
  </section>

</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    let { data } = await axios.get('/api/bs')
    return { items: data }
  },
  head () {
    return {
      title: 'Users'
    }
  },
  data(){
    return {
      selected: [],
      items: [],
      selectMode: 'single',
      item:{
        id:'',
        startDate:'',
        endDate:'',
        title:'',
        description:'',
        linkUrl:'',
        imgUrl:''
      },
      itemState:{
        id:null,
        startDate:null,
        endDate:null,
        title:null,
        description:null,
        linkUrl:null,
        imgUrl:null
      },
    }
  },
  methods: {
    onRowSelected(items) {
      console.log(items)
      if(items[0] != undefined ){
        // this.item = items[0].clone();
        this.item = Object.assign({}, items[0]);//値のコピー
        console.log(this.item)
      }
    },
    onListSelected(items) {
      console.log(items)
      if(items[0] != undefined ){
        // this.item = items[0].clone();
        this.item = Object.assign({}, items[0]);//値のコピー
        console.log(this.item)
      }

    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    },
    createNewItem: function(){
      // axios.post('/api/bs',JSON.stringify(this.item))
      var params = new URLSearchParams();
      Object.keys(this.item).forEach(function(data) {
        params.append(data, this.item[data]);
      },this)
      axios.post('/api/bs', params)
          .then(response => {
            console.log(response)
            this.getItemList()
          })
          .catch(response => console.log(response))
    },
    getItemList: function(){
      console.log('getItemList')
      axios.get('/api/bs')
          .then(response => {
            console.log(response.data)
            this.items = response.data
          })
          .catch(response => console.log(response))
    },
    deleteItem: function(){
      var params = new URLSearchParams();
      // params.append('id', this.item.id);
      axios.delete('/api/bs/' + this.item.id, params)
          .then(response => {
            console.log(response)
            this.getItemList()
          })
          .catch(response => console.log(response))
      this.$refs.modal.hide()
    },
    handleOk(bvModalEvt) {
      // モーダルを閉じない
      // bvModalEvt.preventDefault()

      // Trigger submit handler
      this.createNewItem()
      this.$refs.modal.hide()
    },
    resetModal() {
      Object.keys(this.item).forEach(function(data) {
        this.item[data]　=''
      },this)
      this.$refs.selectableTable.clearSelected()
    },
  }
}
</script>
