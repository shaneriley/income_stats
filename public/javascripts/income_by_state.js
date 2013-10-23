// http://snipplr.com/view.php?codeview&id=14056
var states = {
  "al": "Alabama",
  "ak": "Alaska",
  "az": "Arizona",
  "ar": "Arkansas",
  "ca": "California",
  "co": "Colorado",
  "ct": "Connecticut",
  "de": "Delaware",
  "dc": "District of Columbia",
  "fl": "Florida",
  "ga": "Georgia",
  "hi": "Hawaii",
  "id": "Idaho",
  "il": "Illinois",
  "in": "Indiana",
  "ia": "Iowa",
  "ks": "Kansas",
  "ky": "Kentucky",
  "la": "Louisiana",
  "me": "Maine",
  "md": "Maryland",
  "ma": "Massachusetts",
  "mi": "Michigan",
  "mn": "Minnesota",
  "mo": "Missouri",
  "mt": "Montana",
  "ne": "Nebraska",
  "nv": "Nevada",
  "nh": "New Hampshire",
  "nj": "New Jersey",
  "nm": "New Mexico",
  "ny": "New York",
  "nc": "North Carolina",
  "nd": "North Dakota",
  "oh": "Ohio",
  "ok": "Oklahoma",
  "or": "Oregon",
  "pa": "Pennsylvania",
  "ri": "Rhode Island",
  "sc": "South Carolina",
  "sd": "South Dakota",
  "tn": "Tennessee",
  "tx": "Texas",
  "ut": "Utah",
  "vt": "Vermont",
  "va": "Virginia",
  "wa": "Washington",
  "wv": "West Virginia",
  "wi": "Wisconsin",
  "wy": "Wyoming"
};

var chart = {
  $el: $("svg"),
  $active: $(),
  data_template: Handlebars.compile($("#data").html()),
  current_year: 2011,
  highlight: function(e) {
    var $state = $(e.currentTarget),
        $data = this.createData($state.attr("id"));

    this.removeActive();
    this.$active = $state;
    $state.addSVGClass("active");
    $data.appendTo(document.body);
    this.position($data).to($state);
  },
  position: function($el) {
    return {
      to: function($anchor) {
        var w = $anchor[0].getBBox().width,
            o = $anchor.offset(),
            left = o.left + (o.left < table.$el.width() / 2 ? w : -$el.innerWidth());
        $el.css({
          left: left,
          top: o.top - $el.innerHeight() / 2
        });
      }
    }
  },
  createData: function(state_abbr) {
    var state_name = states[state_abbr],
        row = table.findDataByState(state_name);
    row.income = row[this.current_year];
    row.current_year = this.current_year;
    return $(this.data_template(row));
  },
  hideData: function(e) {
    var $e = $(e.target);
    if ($e.is(".state") || $e.closest(".state").length) { return; }
    this.removeActive();
  },
  removeActive: function() {
    $(".data").remove();
    this.$active.removeSVGClass("active");
  },
  init: function() {
    this.$el.on("click", ".state", $.proxy(this.highlight, this));
    $(document).on("click", $.proxy(this.hideData, this));
  }
};

var table = {
  create: function() {
    this.$el.append(Handlebars.compile($("#tbody").html())({ rows: this.data }));
  },
  findDataByState: function(state) {
    var row;
    $.each(this.data, function(i, data) {
      if (data.state === state) {
        row = data;
        return false;
      }
    });
    return row;
  },
  init: function(data) {
    this.data = data;
    this.$el = $("table");
    this.create();
  }
};

$.ajax({
  url: "/api/median_household_income_state.json",
  type: "get"
}).done($.proxy(table.init, table), $.proxy(chart.init, chart));

$.fn.addSVGClass = function(klass) {
  return this.each(function() {
    if ((new RegExp(klass)).test(this.className.baseVal)) { return; }
    this.className.baseVal += " " + klass;
  });
};

$.fn.removeSVGClass = function(klass) {
  return this.each(function() {
    var rxp = new RegExp(klass),
        val = this.className.baseVal;
    if (rxp.test(val)) {
      this.className.baseVal = $.trim(val.replace(rxp, ""));
    }
  });
};
