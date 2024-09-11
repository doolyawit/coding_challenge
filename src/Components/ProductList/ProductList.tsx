import { Product, ProductsResponse } from '../../Types/Product'
import ProductItem from './ProductItem'
import { useContext, useEffect, useState } from 'react'
import { ProductHttpService } from '../../Http/Products.http.service'
import Box from '@mui/material/Box'
import { Badge, Button, Typography } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { NavLink } from 'react-router-dom'
import { CartContext } from '../Contexts/CarProvider'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const cartContext = useContext(CartContext)

  useEffect(() => {
    ProductHttpService.getProducts().then((data: ProductsResponse) => {
      setProducts(data.products)
    })
  }, [])

  return (
    <Box display='flex' justifyContent='center' flexDirection='column' height='100%'>
      <Typography align='center' variant='h4' fontWeight={900} mt={11} fontSize={24}>
        Products
      </Typography>
      <div className='product-list-container'>
        <div className='product-list-grid'>
          {products.map((product, index) => (
            <ProductItem key={index} product={product} />
          ))}
        </div>
        <Box
          display='flex'
          justifyContent='center'
          flexDirection='column'
          alignItems='center'
          gap={1}
        >
          <NavLink to={'/checkout'}>
            <Badge badgeContent={cartContext.totalQuantity} color='error'>
              <Button
                color='primary'
                variant='contained'
                sx={{ borderRadius: '50%', minWidth: '25px', padding: 1 }}
              >
                <ShoppingCartOutlinedIcon fontSize='small' />
              </Button>
            </Badge>
          </NavLink>
          <Typography
            align='center'
            variant='body2'
            fontWeight={500}
            fontSize={12}
            color={'#697386'}
          >
            Checkout
          </Typography>
        </Box>
      </div>
    </Box>
  )
}
