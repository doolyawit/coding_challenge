import { Grid, Typography } from '@mui/material'
import { Product } from '../../Types/Product'

interface ProductProps {
  product: Product
}

export default function CheckoutItem(props: ProductProps) {
  return (
    <Grid container display='flex' flexDirection='row' justifyContent={'center'}>
      <Grid
        item
        xs={10}
        width={'421px'}
        justifyContent={'space-between'}
        flexDirection={'row'}
        display={'flex'}
      >
        <Grid display={'flex'} flexDirection='row' gap={2.5} alignItems={'center'}>
          <div
            className='avatar'
            style={{
              width: '28px',
              height: '28px',
            }}
          />
          <Typography variant='body2' display={'flex'} flexDirection={'column'}>
            <span
              style={{
                marginBottom: '3px',
                fontWeight: 700,
                color: '#626262',
              }}
            >
              {props.product.name}
            </span>
            <span
              style={{
                color: '#6A52FF',
                fontWeight: 500,
              }}
            >
              {props.product.price} {props.product.currency}
            </span>
          </Typography>
        </Grid>
        <Grid display={'flex'} flexDirection={'column'} gap={0.25} justifyContent={'center'}>
          <span
            style={{
              color: '#6A52FF',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {(props.product.price * props.product.quantity).toFixed(0)} {props.product.currency}
          </span>
          <span
            style={{
              color: '#A7A7A7',
              fontSize: 12,
              fontWeight: 400,
              textAlign: 'end',
            }}
          >
            qty: {props.product.quantity}
          </span>
        </Grid>
      </Grid>
    </Grid>
  )
}
