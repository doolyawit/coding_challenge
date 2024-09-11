import { Grid, Typography } from '@mui/material'
import { Product } from '../../Types/Product'
import theme from '../../theme'
import { useContext, useEffect, useState } from 'react'
import { CartContext } from '../Contexts/CarProvider'
import { Add, Remove } from '@mui/icons-material'

interface ProductProps {
  product: Product
}

export default function ProductItem(props: ProductProps) {
  const [quantity, setQuantity] = useState<number>(0)
  const cartContext = useContext(CartContext)

  useEffect(() => {
    quantity > 0
      ? cartContext.updateCart(props.product, quantity)
      : cartContext.removeFromCart(props.product.id)
  }, [quantity])

  return (
    <Grid
      item
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='69px'
      mb={4}
      xs={4}
      sx={{
        [theme.breakpoints.down('sm')]: {
          maxWidth: '100%',
          minWidth: '100%',
        },
      }}
    >
      <div className='avatar' />
      <Typography
        variant='body2'
        fontWeight={700}
        mt={0.5}
        mb={0.75}
        style={{ padding: '0px 3px', width: '100%', color: '#626262' }}
        fontSize={14}
      >
        {props.product.name}
      </Typography>
      <Grid display='flex' flexDirection='row' gap={0.375}>
        <Typography color='primary' variant='caption' fontWeight={500}>
          {props.product.price}
        </Typography>
        <Typography color='primary' variant='caption'>
          {props.product.currency}
        </Typography>
      </Grid>
      <Grid display='flex' flexDirection='row' gap={1.25}>
        <div
          onClick={() => setQuantity((prevState) => Math.max(prevState - 1, 0))}
          style={{
            cursor: quantity === 0 ? 'not-allowed' : 'pointer',
            border: '1px solid #e8e8eb',
            borderRadius: '3px',
            width: '16px',
            height: '16px',
          }}
        >
          <Remove
            color={quantity === 0 ? 'disabled' : 'primary'}
            style={{
              width: '16px',
              height: '16px',
            }}
          />
        </div>
        <Typography
          variant='body2'
          color={'#6C6C6C'}
          fontWeight={500}
          style={{
            height: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {quantity}
        </Typography>
        <div
          onClick={() => setQuantity((prevState) => prevState + 1)}
          style={{
            cursor: 'pointer',
            border: '1px solid #e8e8eb',
            borderRadius: '3px',
            width: '16px',
            height: '16px',
          }}
        >
          <Add
            color='primary'
            style={{
              width: '16px',
              height: '16px',
            }}
          />
        </div>
      </Grid>
      <Typography
        color='text.secondary'
        variant='caption'
        mt={0.375}
        style={{
          color: '#A7A7A7',
        }}
      >
        quantity
      </Typography>
    </Grid>
  )
}
