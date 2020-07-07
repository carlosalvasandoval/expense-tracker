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
              v-bind:class="{ '': isNew ,'d-none':!isNew}"
              class="btn btn-success"
              type="button"
              @click="addExpense"
            >Add expense</button>
            <button
              v-bind:class="{ 'd-none': isNew, '':!isNew }"
              class="btn btn-success"
              type="button"
              @click="updateExpense"
            >Update expense</button>
            <button
              v-bind:class="{ 'd-none': isNew, '':!isNew }"
              class="btn btn-danger"
              type="button"
              @click="cancel"
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="py-4">
          <span class="h2">My expenses,</span>
          <select class="custom-select col-3" v-model="yearSelected" @change="retrieveMonths()">
            <option v-if="years.length == 0">{{defaultYear}}</option>
            <option v-for="year in years" :key="year.id">{{year.year}}</option>
          </select>

          <select class="custom-select col-3" v-model="monthSelected" @change="retrieveExpenses()">
            <option v-if="months.length == 0">{{defaultMonth}}</option>
            <option value>Select Month</option>
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
          <tr v-for="expense in expenses" :key="expense.id">
            <td>{{expense.item}}</td>
            <td>{{expense.cost}}</td>
            <td>{{expense.created_at | moment("M/D/Y") }}</td>
            <td>
              <button class="btn btn-sm btn-secondary" @click="deleteExpense(expense.id)">Remove</button>
              <button class="btn btn-sm btn-secondary" @click="bindForm(expense.id)">Edit</button>
            </td>
          </tr>
        </table>
      </div>

      <div class="col-md-4">
        <h2 class="py-4">Summary</h2>
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
import { mapState } from "vuex";
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
      defaultYear: new Date().getFullYear(),
      defaultMonth: new Date().getMonth() + 1,
      yearSelected: new Date().getFullYear(),
      monthSelected: new Date().getMonth() + 1,
      isNew: true,
      expenseToedit: {}
    };
  },
  computed: {
    ...mapState({
      arrayYearsFromStore: state => state.years,
      arrayMonthsFromStore: state => state.months,
      expenses: state => state.expenses
    })
  },
  watch: {
    expenses(val) {
      this.calcSummary();
    }
  },
  async mounted() {
    await this.$store.dispatch("retrieveYears");
    this.years = this.arrayYearsFromStore;
    await this.$store.dispatch("retrieveMonths", this.yearSelected);
    this.months = this.arrayMonthsFromStore;
    await this.$store.dispatch("retrieveExpenses", {
      year: this.yearSelected,
      month: this.monthSelected
    });
  },
  methods: {
    async retrieveMonths() {
      this.monthSelected = null;
      await this.$store.dispatch("retrieveMonths", this.yearSelected);
      this.months = this.arrayMonthsFromStore;
    },
    async retrieveExpenses() {
      if (!this.monthSelected) {
        this.flash("Select a month", "error");
        return;
      }
      await this.$store.dispatch("retrieveExpenses", {
        year: this.yearSelected,
        month: this.monthSelected
      });
    },
    suggestionList() {
      let uniq = _.uniqBy(this.expenses, "item");
      return uniq.map(({ item }) => item);
    },
    async addExpense() {
      if (this.item.trim() == "" || this.cost.trim() == "") {
        this.flash("Item and cost are required", "error");
        return;
      }
      let response = await this.$store.dispatch("addExpense", {
        item: this.item,
        cost: this.cost,
        year: this.yearSelected,
        month: this.monthSelected
      });
      this.flash(response, "success");
      this.item = "";
      this.cost = "";
    },
    async deleteExpense(id) {
      let response = await this.$store.dispatch("deleteExpense", id);
      this.flash(response, "success");
    },
    async updateExpense() {
      this.expenseToedit.item = this.item;
      this.expenseToedit.cost = this.cost;
      let response = await this.$store.dispatch(
        "updateExpense",
        this.expenseToedit
      );
      this.calcSummary();
      this.flash(response, "success");
      this.item = "";
      this.cost = "";
      this.expenseToedit = {};
      this.isNew = !this.isNew;
    },
    bindForm(id) {
      this.isNew = false;
      this.expenseToedit = this.expenses.find(expense => expense.id === id);
      this.item = this.expenseToedit.item;
      this.cost = this.expenseToedit.cost;
    },
    cancel() {
      this.isNew = !this.isNew;
    },
    async calcSummary() {
      if (this.expenses.length > 0) {
        this.totalExpenses = this.expenses
          .map(obj => parseFloat(obj.cost))
          .reduce((a, c) => parseFloat(a) + parseFloat(c))
          .toFixed(2);

        this.totalExpensesByItem = this.expenses.reduce((res, value) => {
          if (!res[value.item]) {
            res[value.item] = { item: value.item, cost: 0 };
          }
          res[value.item].cost = (
            parseFloat(res[value.item].cost) + parseFloat(value.cost)
          ).toFixed(2);
          return res;
        }, {});
      }
    }
  }
};
</script>