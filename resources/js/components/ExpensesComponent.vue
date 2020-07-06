<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <vue-simple-suggest
          placeholder="Item name"
          v-model="item"
          :max-suggestions="10"
          :min-length="3"
          :list="suggestionList"
          :styles="autoCompleteStyle"
          :destyled="true"
          :filter-by-query="true"
          :controls="{
          selectionUp: [38, 33],
          selectionDown: [40, 34],
          select: [13, 36],
          showList: [40],
          hideList: [27, 35]
        }"
        ></vue-simple-suggest>
      </div>
      <div class="col-md-4">
        <div class="input-group">
          <input type="number" class="form-control" placeholder="Item cost" v-model="cost" />
          <div class="input-group-append">
            <button
              class="btn btn-success"
              type="button"
              id="button-addon2"
              @click="addExpense"
            >Add expense</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="py-4">
          <span class="h2">My expenses,</span>
          <select class="custom-select col-3" v-model="yearSelected" @change="retrieveMonths()">
            <option v-for="year in years" :key="year.id">{{year.year}}</option>
          </select>

          <select class="custom-select col-3" v-model="monthSelected" @change="retrieveExpenses()">
            <option v-for="month in months" :key="month.id">{{month.month}}</option>
          </select>
        </div>
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th>Item</th>
              <th>Cost</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tr v-for="expense in expenses.data" :key="expense.id">
            <td>{{expense.item}}</td>
            <td>{{expense.cost}}</td>
            <td>{{expense.created_at | moment("M/D/Y") }}</td>
            <td>
              <button class="btn btn-sm btn-secondary" @click="deleteExpense(expense.id)">Remove</button>
              <button class="btn btn-sm btn-secondary">Edit</button>
            </td>
          </tr>
        </table>
      </div>

      <div class="col-md-4">
        <h2 class="py-4">Sumary</h2>
        <div class="card">
          <h5 class="card-header">
            Total:
            <b>{{totalExpenses}}</b>
          </h5>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item"
                v-for="expense in totalExpensesByItem"
                :key="expense.id"
              >{{expense.item}} : {{expense.cost}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueSimpleSuggest from "vue-simple-suggest";
export default {
  components: {
    VueSimpleSuggest
  },
  data() {
    return {
      autoCompleteStyle: {
        vueSimpleSuggest: "position-relative",
        defaultInput: "form-control",
        suggestions: "position-absolute list-group z-1000",
        suggestItem: "list-group-item"
      },
      item: "",
      cost: "",
      totalExpenses: 0,
      totalExpensesByItem: [],
      years: [],
      months: [],
      yearSelected: new Date().getFullYear(),
      monthSelected: (new Date().getMonth() + 1).toString().padStart(2, "0")
    };
  },
  created() {
    this.$store.dispatch("retrieveYears").then(response => {
      this.years = this.$store.getters.years.data;
      this.$store
        .dispatch("retrieveMonths", this.yearSelected)
        .then(response => {
          this.months = this.$store.getters.months.data;
          /*      this.$store.dispatch("retrieveExpenses",this.yearSelected, this.monthSelected).then(response => {
            this.totalExpenses = this.$store.getters.expenses.data
              .map(expense => expense.cost)
              .reduce((prev, next) => prev + next)
              .toFixed(2);

            this.totalExpensesByItem = this.$store.getters.expenses.data.reduce(
              function(res, value) {
                if (!res[value.item]) {
                  res[value.item] = { item: value.item, cost: 0 };
                }
                res[value.item].cost += value.cost;
                return res;
              },
              {}
            );
          }); */
        });
    });
  },
  computed: {
    expenses() {
      return this.$store.getters.expenses;
    }
  },
  methods: {
    retrieveMonths() {
      this.monthSelected = null;
      this.$store
        .dispatch("retrieveMonths", this.yearSelected)
        .then(response => {
          this.months = this.$store.getters.months.data;
        });
    },
    retrieveExpenses() {
      //return;
      if (this.monthSelected == null) {
        this.flash("Select a month", "error");
        return;
      }
      this.$store
        .dispatch("retrieveExpenses", {
          year: this.yearSelected,
          month: this.monthSelected
        })
        .then(response => {
          this.totalExpenses = this.$store.getters.expenses.data
            .map(expense => expense.cost)
            .reduce((prev, next) => prev + next)
            .toFixed(2);

          this.totalExpensesByItem = this.$store.getters.expenses.data.reduce(
            function(res, value) {
              if (!res[value.item]) {
                res[value.item] = { item: value.item, cost: 0 };
              }
              res[value.item].cost += value.cost;
              return res;
            },
            {}
          );
        });
    },
    suggestionList() {
      let uniq = _.uniqBy(this.expenses.data, "item");
      return uniq.map(({ item }) => item);
    },
    addExpense() {
      if (this.item.trim() == "" || this.cost.trim() == "") {
        this.flash("Item and cost are required", "error");
        return;
      }
      this.$store
        .dispatch("addExpense", {
          item: this.item,
          cost: this.cost
        })
        .then(response => {
          this.flash(response.data.status, "success");
        });
      this.item = "";
      this.cost = "";
    },
    deleteExpense(id) {
      this.$store.dispatch("deleteExpense", id).then(response => {
        this.flash(response.data.status, "success");
      });
    }
  }
};
</script>