import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';

export class PdfService {
  constructor() {
    this.options = {
      margin: [30, 40],
      filename: `${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait' },
    };
    this.doc = new jsPDF(this.options.jsPDF);
    this.currentPageContentSize = 0;
    this.PAGE_HEIGHT = 800; /*A-4 height 1120 px */
    // this.PAGE_HEIGHT = this.doc.internal.pageSize.getHeight()
    this.pageWrapper = document.createElement('div');
  }

  async generatePdf() {
    // pick out all nodes with class name "report_node" and create report pages those fit content
    // create 'div' that will be page wrapper and after that create pages
    const nodes = document.getElementsByClassName('report_node');
    // loop thrue nodes and create pages
    await this.createPages(nodes);
    this.doc.save(this.options.filename);
  }

  async createPages(nodes) {
    // loop thrue nodes and create pages
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const lastNode = i === nodes.length - 1;
      node && (await this.addNodeToPage(node, lastNode));
    }
  }

  async addNodeToPage(node, lastNode) {
    const nodeHeight = node.offsetHeight;
    const nodeFitInPage = this.currentPageContentSize + nodeHeight < this.PAGE_HEIGHT;
    const nodeBigerThanPage = nodeHeight > this.PAGE_HEIGHT;
    // create page form nodes
    if (nodeFitInPage) {
      // add node to page
      this.currentPageContentSize += nodeHeight;
      this.pageWrapper.appendChild(node.cloneNode(true));
      if (lastNode) await this.addImageToPDF();
    } else if (nodeBigerThanPage) {
      if (node.nodeName === 'TABLE') {
        await this.createMultiPageTable(node.children);
      } else {
        await this.createPages(node.children);
      }
    } else {
      //insert an image into previous page && add page to pdf
      this.currentPageContentSize = nodeHeight;
      await this.addImageToPDF();
      // after creating page remove all children from wrapper and add node
      this.pageWrapper.appendChild(node.cloneNode(true));
      // add new page if not last node
      if (!lastNode) this.doc.addPage();
    }
  }

  async addImageToPDF() {
    try {
      // if blank page (empty <div>) it will be an error
      const nodeImage = await html2pdf().from(this.pageWrapper).set(this.options).outputImg();
      this.doc.addImage(nodeImage.src, 'jpeg', this.options.margin[0], this.options.margin[1]);
      this.pageWrapper.querySelectorAll('*').forEach((n) => n.remove());
    } catch (e) {
      console.log(e);
    }
  }

  async createMultiPageTable(tableNodes) {
    const tHead = tableNodes[0];
    const tBody = tableNodes[1];
    const tRows = tBody.childNodes;
    const table = document.createElement('table');
    table.style.width = '100%';
    const tableBody = document.createElement('tbody');
    // add table head into table
    table.appendChild(tHead.cloneNode(true));
    this.currentPageContentSize += tHead.offsetHeight;
    // insert table body into table
    table.appendChild(tableBody);
    for (let i = 0; i < tRows.length; i++) {
      const row = tRows[i];
      const lastNode = i === tRows.length - 1;
      await this.addNodeItemTable(row, tableBody, table, lastNode);
    }
  }

  async addNodeItemTable(node, parentNode, table, lastNode) {
    const nodeSize = node.offsetHeight;
    const nodeFitInPage = this.currentPageContentSize + nodeSize <= this.PAGE_HEIGHT;
    try {
      if (nodeFitInPage) {
        parentNode.appendChild(node.cloneNode(true));
        this.currentPageContentSize += nodeSize;
        if (lastNode) {
          this.pageWrapper.appendChild(table.cloneNode(true));
          await this.addImageToPDF();
          this.doc.addPage();
          this.currentPageContentSize = 0;
        }
      } else {
        // if only table header fit into current page  ==> add existing page to PDF and create new page
        if (!parentNode.children.length) {
          await this.addImageToPDF();
          this.currentPageContentSize = nodeSize;
          parentNode.appendChild(node.cloneNode(true));
          this.doc.addPage();
        } else {
          this.currentPageContentSize = nodeSize;
          // add table to page
          this.pageWrapper.appendChild(table.cloneNode(true));
          // add page to report
          await this.addImageToPDF();
          // delete children from parent node
          parentNode.querySelectorAll('*').forEach((n) => n.remove());
          // add row to parent node
          parentNode.appendChild(node.cloneNode(true));
          this.doc.addPage();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
