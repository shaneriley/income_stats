var table = {
  create: function() {
    this.$el.append(Handlebars.compile($("#tbody").html())({ rows: this.data }));
  },
  init: function(data) {
    this.data = data;
    this.$el = $("table");
    this.create();
  }
};

$.ajax({
  url: "/api/median_household_income_state.json",
  type: "get",
  success: $.proxy(table.init, table)
});
