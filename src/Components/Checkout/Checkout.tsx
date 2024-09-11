import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { ChangeEvent, useContext, useState } from 'react'
import theme from '../../theme'
import CheckoutItem from './CheckoutItem'
import { ProductHttpService } from '../../Http/Products.http.service'
import { Payment, PaymentResponse } from '../../Types/Product'
import { CartContext } from '../Contexts/CarProvider'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const navigate = useNavigate()

  const [displayResponse, setDisplayResponse] = useState<boolean>()
  const [response, setResponse] = useState<PaymentResponse>({
    result: {
      errorCode: '0',
      errorDesc: '',
    },
  } as PaymentResponse)
  const cartContext = useContext(CartContext)

  const [email, setEmail] = useState<string | undefined>(undefined)
  const [emailError, setEmailError] = useState<string | undefined>(undefined)

  const [cardNumber, setCardNumber] = useState<string | undefined>(undefined)
  const [cardNumberError, setCardNumberError] = useState<string | undefined>(undefined)

  const [cardDate, setCardDate] = useState<string | undefined>(undefined)
  const [cardDateError, setCardDateError] = useState<string | undefined>(undefined)

  const [cardCvc, setCardCvc] = useState<string | undefined>(undefined)
  const [cardCvcError, setCardCvcError] = useState<string | undefined>(undefined)

  const [formError, setFormError] = useState<string | undefined>(undefined)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (!value) {
      setEmailError('Please enter your email')
    } else {
      setEmailError(undefined)
    }
  }

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(.{4})/g, '$1 ').trim()
    setCardNumber(value)

    if (!value) {
      setCardNumberError('Please enter your card number')
    } else if (!['2', '4', '5'].includes(value[0])) {
      setCardNumberError('Valid card number')
    } else if (value.length < 19) {
      setCardNumberError('Valid card number')
    } else {
      setCardNumberError(undefined)
    }
  }

  const isFutureDate = (month: number, year: number) => {
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()
    return year > currentYear || (year === currentYear && month >= currentMonth)
  }

  const handleCardDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 2) {
      value = value.slice(0, 2) + ' / ' + value.slice(2)
    }
    setCardDate(value)
    const rawValue = value.replace(/\s|\/+/g, '')

    if (!value) {
      setCardDateError('Please enter your card date')
    } else if (rawValue.length !== 4) {
      setCardDateError('Expiry date must be in MM / YY format')
    } else {
      const month = parseInt(rawValue.slice(0, 2), 10)
      const year = parseInt('20' + rawValue.slice(2), 10)

      if (month < 1 || month > 12) {
        setCardDateError('Expiry month must be between 01 and 12')
      } else if (!isFutureDate(month, year)) {
        setCardDateError('Expiry date must be in the future')
      } else {
        setCardDateError(undefined)
      }
    }
  }

  const handleCardCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCardCvc(value)

    if (!value) {
      setCardCvcError('Please enter your card CVC')
    } else if (!Number(value)) {
      setCardCvcError('CVC must be a number')
    } else {
      setCardCvcError(undefined)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (cardNumberError || cardDateError || cardCvcError || emailError) {
      return
    } else if (!email || !cardNumber || !cardDate || !cardCvc) {
      setFormError('Please fill the information all of the fields ')
      return
    } else if (Object.values(cartContext.cart).length === 0) {
      setFormError('Please select at least 1 product')
      return
    } else {
      setFormError(undefined)
    }

    const parseValue: Payment = {
      requestId: '12344556',
      paymentInfo: {
        email: email ?? '',
        cardInfo: {
          cardNo: cardNumber ?? '',
          cardExpiryDate: cardDate ?? '',
          cardCVV: cardCvc ?? '',
        },
      },
      products: Object.values(cartContext.cart).map((product) => {
        return {
          id: product.id,
          quantity: product.quantity,
        }
      }),
    }
    await ProductHttpService.buyProducts(parseValue).then((data: PaymentResponse) => {
      setResponse(data)
      setDisplayResponse(data.result.errorCode === '0' ? false : true)
      if (data.result.errorCode === '0') {
        setTimeout(() => {
          navigate('/thanks')
        })
      } else {
        return
      }
    })
  }

  const getTotalCost = (): number => {
    return cartContext.totalCost
  }

  return (
    <Grid container display='flex' justifyContent='center'>
      <Grid
        display='flex'
        flexDirection='column'
        gap={2}
        maxWidth={'700px'}
        m={10}
        sx={{
          [theme.breakpoints.down('sm')]: {
            maxWidth: 'unset',
          },
        }}
      >
        <Grid xs={12} item mb={4}>
          <Typography align='center' variant='h4' fontWeight={900} color={'#1A1F36'} mb={7.25}>
            Checkout
          </Typography>
          <Grid display={'flex'} flexDirection={'column'} gap={2}>
            {cartContext.cart &&
              Object.values(cartContext.cart).map((product, index) => {
                return <CheckoutItem product={product} key={index} />
              })}
          </Grid>
        </Grid>
        <form onSubmit={onSubmit} style={{ maxWidth: '421px' }}>
          <Grid xs={12} item display='flex' flexDirection='column' gap={2} mt={4}>
            <Typography fontWeight={700} color={'#697386'} fontSize={14}>
              Email
            </Typography>
            <TextField
              id='email'
              variant='outlined'
              placeholder='jhon@example.com'
              value={email}
              error={emailError !== undefined}
              onChange={handleEmailChange}
            />
            {emailError && (
              <span style={{ color: '#F67272', fontSize: 11, fontWeight: 500 }}>{emailError}</span>
            )}

            <Typography fontWeight={700} color={'#697386'} fontSize={14}>
              Card Information
            </Typography>
            <TextField
              id='cardNumber'
              variant='outlined'
              inputProps={{ maxLength: 19 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    {(cardNumber && cardNumber[0]) === '4' && (
                      <Box component='img' src='visa.svg' sx={{ width: '20px' }} />
                    )}
                    {cardNumber && (cardNumber[0] === '2' || cardNumber[0] === '5') && (
                      <Box component='img' ml={1} src='mastercard.svg' sx={{ width: '20px' }} />
                    )}
                  </InputAdornment>
                ),
              }}
              value={cardNumber}
              error={cardNumberError !== undefined}
              onChange={handleCardNumberChange}
            />
            {cardNumberError && (
              <span style={{ color: '#F67272', fontSize: 11, fontWeight: 500 }}>
                {cardNumberError}
              </span>
            )}
            <Grid container>
              <Grid xs={6} item>
                <TextField
                  id='cardDate'
                  variant='outlined'
                  fullWidth
                  inputProps={{
                    maxLength: 7,
                  }}
                  placeholder='MM / YY'
                  value={cardDate}
                  error={cardDateError !== undefined}
                  onChange={handleCardDateChange}
                />
                {cardDateError && (
                  <span style={{ color: '#F67272', fontSize: 11, fontWeight: 500 }}>
                    {cardDateError}
                  </span>
                )}
              </Grid>
              <Grid xs={6} item>
                <TextField
                  id='cardCvc'
                  variant='outlined'
                  fullWidth
                  inputProps={{
                    maxLength: 3,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Box component='img' src='cvc.png' sx={{ width: '20px' }} />
                      </InputAdornment>
                    ),
                  }}
                  placeholder='CVC'
                  value={cardCvc}
                  error={cardCvcError !== undefined}
                  onChange={handleCardCvcChange}
                />
                {cardCvcError && (
                  <span style={{ color: '#F67272', fontSize: 11, fontWeight: 500 }}>
                    {cardCvcError}
                  </span>
                )}
              </Grid>
            </Grid>
            <Grid xs={12} item justifyContent='center' display='flex' mt={4}>
              <Button variant='contained' color='secondary' type='submit'>
                Pay {Number(getTotalCost()).toFixed(0)} THB
              </Button>
            </Grid>
            {formError && (
              <span
                style={{ color: '#F67272', fontSize: 13, fontWeight: 500, textAlign: 'center' }}
              >
                {formError}
              </span>
            )}
          </Grid>
        </form>
      </Grid>

      <Snackbar
        open={displayResponse}
        autoHideDuration={6000}
        onClose={() => setDisplayResponse(false)}
      >
        <Alert severity={'error'}>{response.result.errorDesc}</Alert>
      </Snackbar>
    </Grid>
  )
}
