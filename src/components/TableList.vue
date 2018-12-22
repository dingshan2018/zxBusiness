<template>
  <div class="table-list">
    <table cellspacing="0" cellpadding="0" border="0" v-if="data.length">
      <colgroup>
        <col v-for="(item, index) in columns" :key="index" :width="setColWidth(item)">
      </colgroup>
      <thead class="table-list__head">
        <tr>
          <th class="van-hairline--bottom" v-for="(item, index) in columns" :key="index">
            <div class="table-cell">{{ item.title }}</div>
          </th>
        </tr>
      </thead>
      <tbody class="table-list__body">
        <tr v-for="(dataItem, dataIndex) in data" :key="dataIndex" @click="$emit('onRow', $event.target, dataItem)">
          <td class="van-hairline--bottom" v-for="(columnsItem, columnsIndex) in columns" :key="columnsIndex">
            <div class="table-cell">{{ dataItem[columnsItem["key"]] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="block__loading" v-if="_firstLoading"></div>
    <div class="block__null" v-if="!_firstLoading && _empty">
      <span class="block__null-text">暂无数据</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "table-list",
    props: {
      columns: {
        type: Array,
        default: function () {
          return [];
        }
      },
      data: {
        type: Array,
        default: function () {
          return [];
        }
      },
      firstLoading: {
        type: Boolean,
        default: true
      },
      empty: {
        type: Boolean,
        default: true
      }
    },
    data () {
      this._firstLoading = this.firstLoading;
      this._empty = this.empty;
      console.log(this._firstLoading);
      return {
        _firstLoading: false,
        _empty: false
      };
    },
    watch: {
      data: function (newV, oldV) {
        if (!newV.length && this.empty) {
          this._firstLoading = false;
          this._empty = true;
        }
      }
    },
    methods: {
      setColWidth (item, unit) {
        return unit ? (item.width && item.width + "px") : item.width;
      }
    }
  };
</script>

<style lang="less">

  .table-list {
    position: relative;
    min-height: 400px;

    table {
      width: 100%;
      padding: 0 10px;
    }

    tr {
      position: relative;
    }

    .table-cell {
      min-height: 40px;
      padding: 5px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
    }
  }

  .table-list__head .table-cell {
    font-weight: 600;
    font-size: 13px;
  }

</style>
