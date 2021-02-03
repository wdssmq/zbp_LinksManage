function checkInfo() {
  if (!$("#edtName").val()) {
    alert("<?php echo $lang['error']['72'] ?>");
    return false;
  }
  if (!$("#edtFileName").val()) {
    alert("<?php echo $lang['error']['75'] ?>");
    return false;
  }
  if (!$("#edtHtmlID").val()) {
    $("#edtHtmlID").val($("#edtFileName").val());
    return false;
  }
}

// fnReplaceHost("旧内容","新内容");
function fnReplaceHost(o, n) {
  $("input[name='href[]']").each(function () {
    let curVal = $(this).val();
    let newVal = curVal.replace(o, n);
    $(this).val(newVal);
  });
}

$(function () {
  if ($(".js-mod").length > 0) {
    let LinksManage = $(".js-mod").val().split("|"),
      mod;
    for (link in LinksManage) {
      if ((mod = LinksManage[link])) {
        $(".widget-list .widget_id_" + mod)
          .addClass("LinksManage")
          .find("a:first")
          .attr(
            "href",
            bloghost + "zb_users/plugin/LinksManage/main.php" + "?edit=" + mod
          );
        $(".SubMenu")
          .find("a[href$='" + mod + "']")
          .addClass("LinksManage")
          .attr(
            "href",
            bloghost + "zb_users/plugin/LinksManage/main.php" + "?edit=" + mod
          );
      }
    }
    // $(".LinksManage").click(function() {
    //   let x = confirm("此处仅能创建UL列表，DIV创建请用“新建模块”");
    //   if (!x) {
    //     return false;
    //   }
    // });
  }
  ///////////
  $(".js-add").click(function () {
    if ($(".LinksManageAdd").length === 1) {
      $("#LinksManageList").append($("tfoot .LinksManageAdd").clone());
    }
    $("#LinksManageList .LinksManageAdd").each(function () {
      $(this).removeClass("LinksManageAdd");
    });
    return;
  });
  $("#LinksManageList td").each(function () {
    let intWidth = $(this).width();
    $(this).css({ width: intWidth });
    // $(this).data("width", intWidth);
  });
  $("#LinksManageList").sortable({
    axis: "y",
    opacity: 0.5,
    cursor: "move",
    delay: 150,
    stop: function (event, ui) {
      $("input[name='sub[]']")
        .next(".imgcheck")
        .click(function () {
          var me = this;
          setTimeout(function () {
            $(me)
              .closest("tr")
              [$(me).hasClass("imgcheck-on") ? "addClass" : "removeClass"](
                "LinksManageSub"
              );
          }, 20);
        });
    },
  });

  $("#LinksManageDel").droppable({
    accept: "#LinksManageList tr",
    addClasses: false,
    drop: function (event, ui) {
      ui.draggable.remove();
    },
    over: function (event, ui) {
      $(this).find("td").html("松手删除");
    },
    out: function (event, ui) {
      $(this).find("td").html("拖入这里删除");
    },
    activeClass: "active",
    hoverClass: "hover",
  });
  $("input[name='sub[]']")
    .next(".imgcheck")
    .click(function () {
      let me = this;
      setTimeout(function () {
        $(me)
          .closest("tr")
          [$(me).hasClass("imgcheck-on") ? "addClass" : "removeClass"](
            "LinksManageSub"
          );
      }, 20);
    });

  // 搜索相关
  $("#search-box").draggable({
    cancel: "select,button,a,input,p",
    cursor: "move",
  });

  $(".js-search").click(function () {
    const opt = {};
    opt.top = $("#LinksManageDel").offset().top;
    fnShowBox($("#search-box"), 0, opt);
  });
  $("#search-box").dblclick(function (e) {
    fnShowBox($("#search-box"), e.target.nodeName === "DIV");
  });
  function fnShowBox($el, hide = 0, opt = {}) {
    if ($el.is(":hidden") || Object.keys(opt).length) {
      // let minWidth = parseInt($el.css("minWidth")),
      //   top = parseInt($el.css("top"));
      opt.top =
        opt.top ||
        ($(window).height() - $el.outerHeight()) / 2 +
          $(window).scrollTop() -
          37;
      opt.left = opt.left || ($(window).width() - $el.outerWidth()) / 2;
      opt.left = opt.mid - $el.outerWidth() / 2 || opt.left;
      if ($el.data("fixed")) {
        $el.fadeIn().addClass("in");
        return;
      }
      $el.data("fixed", 1);
      $el
        .fadeIn()
        .animate({
          top: opt.top,
          left: opt.left,
          minWidth: $el.outerWidth(),
        })
        .addClass("in");
    } else if (!hide) {
      $el.animate({
        minWidth: $el.outerWidth(),
      });
    } else {
      $el.fadeOut();
    }
  }

  // 搜索
  $("#search-btn").click(fnSearch);
  let objPub;
  function fnSearch() {
    let sWord = $("#search-inp").val();
    $("#search-result")
      .empty()
      .append("<option value='查询中'>查询中……</option>");
    fnAjax(sWord, function (data) {
      // console.log(data);
      $("#search-result").empty();
      for (let i in data) {
        let obj = data[i];
        $("<option value='" + obj.ID + "'>" + obj.Title + "</option>")
          .appendTo("#search-result")
          .click(function () {
            $("#search-result").val(obj.ID);
            $("#search-view").html(
              [obj.Title, obj.Url].map((a) => "<p>" + a + "</p>")
            );
            fnShowBox($("#search-box"), 0);
            $("#search-fill").removeAttr("disabled");
            objPub = obj;
          });
        // $("#search-result").append("<option value='Value'>" + obj.Title + "</option>");
      }
    });
  }

  $("#search-do").click(function () {
    $(".js-add").click();

    let $el;
    $("#LinksManageList tr").each(function () {
      console.log($(this).html() == $(".LinksManageAdd").html());
      if ($(this).html() == $(".LinksManageAdd").html()) $el = $(this);
    });
    if ($el) {
      console.log(objPub);
      for (let i in objPub) {
        $el.find(`.fill-${i}`).val(objPub[i]);
      }
    }
  });

  // mock
  return
  function fnAjax(
    q,
    fnback = function (n) {
      console.log(n);
    }
  ) {
    let objRlt;
    $.getJSON(ajaxurl + "LinksManage&q=" + q, function (data) {
      if (data) {
        objRlt = data;
        fnback(objRlt.data);
      }
    });
  }
  (() => {
    fnShowBox($("#search-box"), 0);
    $("#search-inp").val("插件");
  })();
});
