import { Component, OnInit } from '@angular/core';
import "@balkangraph/orgchart.js";
import { CashServiceService } from '../_services';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent implements OnInit {

  nodes: any[] = []
  links: any[] = []
  isLoading: Boolean = true;

  constructor(private apiService: CashServiceService) { }

  ngOnInit() {
    this.apiService.initChart()
      .subscribe(res => {
        console.log('init chart response', res)
        this.nodes = res.result;
        this.initCashChart();
        this.isLoading = false;
      },
        err => console.log('chart init error', err)
      )
  }

  initCashChart() {

    const globalThis = this;

    var editForm = function () {
      this.nodeId = null;
    };

    editForm.prototype.init = function (obj) {
      // console.log('this is ', this)
      var that = this;
      this.obj = obj;
      this.editForm = document.getElementById("editForm");
      this.nameInput = document.getElementById("name");
      this.titleInput = document.getElementById("title");
      this.imgInput = document.getElementById("img");
      this.labelInput = document.getElementById("label");
      this.toInput = document.getElementById("to");
      this.cancelButton = document.getElementById("cancel");
      this.saveButton = document.getElementById("save");

      this.cancelButton.addEventListener("click", function () {
        that.hide();
      });

      this.saveButton.addEventListener("click", function () {
        var node = chart.get(that.nodeId);
        var label = that.labelInput.value;
        var to = that.toInput.value;
        node['name'] = that.nameInput.value;
        node['title'] = that.titleInput.value;
        node['img'] = that.imgInput.value;
        node['label'] = label;
        node['to'] = to;

        // console.log('from, to, label', that.nodeId, to, label)
        console.log('save clicked', node)

        let data = { data: node };
        globalThis.isLoading = true;
        globalThis.apiService.updateChart(data)
          .subscribe(res => {
            console.log('updatded result', res)
            globalThis.isLoading = false;
            // update node
            chart.updateNode(node);
            // update link
            if (to && label) {
              chart.removeClink(that.nodeId, to);
              chart.addClink(that.nodeId, to, label, 'yellow');
              chart.draw();
            }
            that.hide();
          },
            err => {
              globalThis.isLoading = false;
              console.log('update chart error', err)
            })

        // // update node
        // chart.updateNode(node);
        // // update link
        // if (to && label) {
        //   chart.removeClink(that.nodeId, to);
        //   chart.addClink(that.nodeId, to, label, 'yellow');
        //   chart.draw();
        // }
        // that.hide();
      });
    };

    editForm.prototype.show = function (nodeId) {
      this.nodeId = nodeId;

      var left = document.body.offsetWidth / 2 - 150;
      this.editForm.style.display = "block";
      this.editForm.style.left = left + "px";
      var node = chart.get(nodeId);

      this.nameInput.value = node['name'];
      this.titleInput.value = node['title'];
      this.imgInput.value = node['img'];
      this.labelInput.value = '';
      this.toInput.value = '';
    };

    editForm.prototype.hide = function (showldUpdateTheNode) {
      this.editForm.style.display = "none";
    };

    var chart = new OrgChart(document.getElementById('cashFlowChart'), {
      lazyLoading: true,
      menu: {
        pdf: { text: "Export PDF" },
        png: { text: "Export PNG" },
        svg: { text: "Export SVG" },
        csv: { text: "Export CSV" }
      },
      nodeMenu: {
        edit: { text: "Edit" },
        add: { text: "Add" },
        remove: { text: "Remove" }
      },
      editUI: new editForm(),
      nodeBinding: {
        field_0: "name",
        field_1: "title",
        img_0: "img"
      },
      // clinks: this.links
    });
    // chart.CLINK_CURVE = 2.3;

    chart.load(this.nodes);
  }

}
