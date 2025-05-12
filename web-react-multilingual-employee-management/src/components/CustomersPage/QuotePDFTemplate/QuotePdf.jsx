import React, { useState, useEffect } from 'react';
import { styles } from './styles';
import { QUOTE } from '../../../constants/translations/customersPage';
import ProductPdf from './Parts/ProductPdf';
import CustomerAndQuoteInfo from './Parts/CustomerAndQuoteInfo';
import QuoteAgreementPage from './Parts/QuoteAgeementPage';
const VAT_TAX_CALCULATION = 1.17;

const QuotePDF = (props) => {
  const { LOCATION } = QUOTE;

  const {
    products,
    quoteNumber,
    clientName,
    address,
    phoneNumber,
    quoteStatus,
    quoteDate,
    setReadyForPrint,
    remarks,
    projectType,
  } = props;
  const [productsFirstPage, setProductsFirstPage] = useState('');
  const [otherPagesProducts, setOtherPagesProducts] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [totalCostWithVAT, setTotalCostWithVAT] = useState('');

  useEffect(() => {
    const createProductsList = () => {
      const allProducts = [];
      let productsCost = 0;
      products.map((i) =>
        i.products.map((i) => {
          //  orderNumber is for showing product order in pdf
          const newProduct = { ...i, orderNumber: allProducts.length + 1 };
          allProducts.push(newProduct);
          productsCost += +i?.total_cost;
        }),
      );
      const [
        firstProduct,
        secondProduct,
        thirdProduct,
        fourthProduct,
        ...otherSheets
      ] = allProducts;

      const productsForFirstPage = [
        firstProduct,
        secondProduct,
        thirdProduct,
        fourthProduct,
      ].filter((i) => i);
      setProductsFirstPage(productsForFirstPage);
      if (otherSheets?.length) {
        const MAX_QUANTITY_OF_PRODUCTS_ON_PAGE = 5;
        let sheet = [];
        let sheets = [];
        // creating products for not first page
        for (let i = 0; i < otherSheets.length; i++) {
          const product = otherSheets[i];
          sheet.push(product);
          if (sheet.length === MAX_QUANTITY_OF_PRODUCTS_ON_PAGE) {
            sheets.push(sheet);
            sheet = [];
          } else if (i === otherSheets.length - 1 && sheet.length) {
            sheets.push(sheet);
            sheet = [];
          }
        }
        setOtherPagesProducts(sheets);
      } else {
        setOtherPagesProducts([]);
      }
      setTotalCost(productsCost);
      const priceIncludesTax = (productsCost * VAT_TAX_CALCULATION).toFixed(2);
      setTotalCostWithVAT(priceIncludesTax);
    };

    if (products) {
      createProductsList();
    }
  }, [products]);

  useEffect(() => {
    //  + address && phoneNumber &&
    if (
      products &&
      quoteNumber &&
      clientName &&
      quoteStatus &&
      quoteDate &&
      totalCost &&
      totalCostWithVAT &&
      projectType &&
      otherPagesProducts
    )
      setReadyForPrint(true);
    // + address, phoneNumber,
  }, [
    productsFirstPage,
    quoteNumber,
    clientName,
    quoteStatus,
    quoteDate,
    totalCost,
    totalCostWithVAT,
    projectType,
    otherPagesProducts,
  ]);
  // + address && phoneNumber &&
  return productsFirstPage &&
    quoteNumber &&
    clientName &&
    quoteStatus &&
    quoteDate &&
    projectType &&
    otherPagesProducts ? (
    <div id="quote-for-print" style={styles.quotePdfBox}>
      <div style={styles.page} id="quote-info">
        <CustomerAndQuoteInfo
          quoteNumber={quoteNumber}
          clientName={clientName}
          address={address}
          phoneNumber={phoneNumber}
          quoteStatus={quoteStatus}
          quoteDate={quoteDate}
          projectType={projectType}
        />
        <p style={styles.location}>{LOCATION}</p>
        <div style={styles.productWrapper}>
          {productsFirstPage?.map((i, idx) => (
            <ProductPdf key={i._id} product={i} idx={idx} />
          ))}
        </div>
      </div>
      {otherPagesProducts.length ? (
        <div style={styles.page}>
          {otherPagesProducts?.map((i, idx) => (
            <div key={idx} className="quoteProductsPage" style={styles.productWrapper}>
              {' '}
              {i.map((product, idx) => (
                <ProductPdf key={product._id} product={product} idx={idx} />
              ))}
            </div>
          ))}
        </div>
      ) : null}
      <QuoteAgreementPage
        totalCost={totalCost}
        totalCostWithVAT={totalCostWithVAT}
        remarks={remarks}
      />
    </div>
  ) : null;
};

export default QuotePDF;
