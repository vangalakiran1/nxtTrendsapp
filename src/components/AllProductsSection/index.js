import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProcess: 'IN_PROCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInputValue: '',
    activeCategoryId: '',
    activeRatingId: '',
    apiActiveStatus: apiStatus.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  renderElementOnApiStatus = () => {
    const {apiActiveStatus} = this.state
    switch (apiActiveStatus) {
      case apiStatus.success:
        return this.renderProductsList()

      case apiStatus.failure:
        return this.renderFailureElement()

      case apiStatus.inProcess:
        return this.renderLoader()

      default:
        return <p>hello</p>
    }
  }

  getProducts = async () => {
    this.setState({
      apiActiveStatus: apiStatus.inProcess,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategoryId,
      activeRatingId,
      searchInputValue,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInputValue}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiActiveStatus: apiStatus.success,
      })
    } else {
      this.setState({apiActiveStatus: apiStatus.failure})
    }
  }

  onClickChangeCategoryId = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
  }

  onClickChangeRatingId = id => {
    this.setState({activeRatingId: id}, this.getProducts)
  }

  searchFilterChange = inputValue => {
    this.setState({searchInputValue: inputValue})
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const showProductsIsTrue = productsList.length > 0

    // TODO: Add No Products View

    return showProductsIsTrue ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-product-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="no-product-img"
        />
        <h3>No Products Found</h3>
        <p>We Could find any products. Try other filters.</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  clearAllFilter = () => {
    this.setState(
      {
        searchInputValue: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  // TODO: Add failure view

  renderFailureElement = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-img"
      />
      <h3>Oops! Something Went Wrong</h3>
      <p>
        We having some trouble processing your request. <br /> Please try again.
      </p>
    </div>
  )

  render() {
    const {searchInputValue, activeCategoryId, activeRatingId} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          searchFilterChange={this.searchFilterChange}
          searchInputValue={searchInputValue}
          onClickChangeCategoryId={this.onClickChangeCategoryId}
          onClickChangeRatingId={this.onClickChangeRatingId}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          clearAllFilter={this.clearAllFilter}
          enterSearchInput={this.enterSearchInput}
        />

        {/* {isLoading ? this.renderLoader() : this.renderProductsList()} */}
        {this.renderElementOnApiStatus()}
      </div>
    )
  }
}

export default AllProductsSection
