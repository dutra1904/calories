import { useMemo, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { useUnits } from '../context/UnitsContext'
import { translations } from '../i18n/translations'
import { SilhuetaResultado } from './SilhuetaResultado'

const preprocessNumber = (val) =>
  val === '' || val === undefined ? undefined : Number(val)

const LBS_PER_KG = 2.20462
const CM_PER_INCH = 2.54

function createSchemaMetric(t) {
  return z.object({
    genero: z.enum(['male', 'female'], { required_error: t.genderRequired }),
    altura: z.preprocess(
      preprocessNumber,
      z.number({ required_error: t.heightRequired }).min(100, t.heightMin).max(250, t.heightMax)
    ),
    peso: z.preprocess(
      preprocessNumber,
      z.number({ required_error: t.weightRequired }).min(30, t.weightMin).max(300, t.weightMax)
    ),
    idade: z.preprocess(
      preprocessNumber,
      z.number({ required_error: t.ageRequired }).min(1, t.ageMin).max(120, t.ageMax)
    ),
  })
}

function createSchemaUS(t) {
  return z.object({
    genero: z.enum(['male', 'female'], { required_error: t.genderRequired }),
    alturaFeet: z.preprocess(
      preprocessNumber,
      z.number({ required_error: t.heightRequired }).min(3, t.heightFtMin).max(8)
    ),
    alturaInches: z.preprocess(
      (val) => (val === '' || val === undefined ? 0 : Number(val)),
      z.number().min(0, t.heightInMin).max(11)
    ),
    pesoLbs: z.preprocess(
      preprocessNumber,
      z.number({ required_error: t.weightRequired }).min(66, t.weightLbsMin).max(660, t.weightLbsMax)
    ),
    idade: z.preprocess(
      preprocessNumber,
      z.number({ required_error: t.ageRequired }).min(1, t.ageMin).max(120, t.ageMax)
    ),
  })
}

function calcularIMC(pesoKg, alturaCm) {
  const alturaMetros = alturaCm / 100
  return pesoKg / (alturaMetros * alturaMetros)
}

function pesoIdealMin(alturaCm) {
  const alturaMetros = alturaCm / 100
  return 18.5 * (alturaMetros * alturaMetros)
}

function pesoIdealMax(alturaCm) {
  const alturaMetros = alturaCm / 100
  return 24.9 * (alturaMetros * alturaMetros)
}

function classificarIMC(imc, t) {
  const cats = t.categories
  if (imc < 18.5) return { status: 'abaixo', label: cats.abaixo.label, color: 'yellow' }
  if (imc < 25) return { status: 'normal', label: cats.normal.label, color: 'green' }
  if (imc < 30) return { status: 'sobrepeso', label: cats.sobrepeso.label, color: 'orange' }
  if (imc < 35) return { status: 'obeso1', label: cats.obeso1.label, color: 'red' }
  if (imc < 40) return { status: 'obeso2', label: cats.obeso2.label, color: 'red' }
  return { status: 'obeso3', label: cats.obeso3.label, color: 'red' }
}

export function ImcForm() {
  const navigate = useNavigate()
  const { locale } = useLocale()
  const { units } = useUnits()
  const t = translations[locale]
  const schema = useMemo(
    () => (units === 'metric' ? createSchemaMetric(t.validation) : createSchemaUS(t.validation)),
    [locale, units]
  )

  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const mutedColor = useColorModeValue('gray.500', 'gray.400')
  const gainBg = useColorModeValue('yellow.50', 'yellow.900')
  const gainBorder = useColorModeValue('yellow.200', 'yellow.700')
  const gainText = useColorModeValue('yellow.800', 'yellow.200')
  const loseBg = useColorModeValue('red.50', 'red.900')
  const loseBorder = useColorModeValue('red.200', 'red.700')
  const loseText = useColorModeValue('red.800', 'red.200')

  const defaultValues = useMemo(
    () =>
      units === 'metric'
        ? { genero: 'male', altura: '', peso: '', idade: '' }
        : { genero: 'male', alturaFeet: '', alturaInches: '', pesoLbs: '', idade: '' },
    [units]
  )

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues,
  })

  // Reset form when switching units
  useEffect(() => {
    reset(defaultValues)
    setCalculatedResult(null)
  }, [units, defaultValues, reset])

  const [calculatedResult, setCalculatedResult] = useState(null)
  const valores = watch()
  const genero = valores.genero || 'male'

  let alturaCm = 0
  let pesoKg = 0
  const idadeNum = parseInt(valores.idade, 10) || 0
  let temValores = false

  if (units === 'metric') {
    alturaCm = parseFloat(valores.altura) || 0
    pesoKg = parseFloat(valores.peso) || 0
    temValores = alturaCm >= 100 && pesoKg >= 30 && idadeNum >= 1
  } else {
    const feet = parseFloat(valores.alturaFeet) || 0
    const inches = parseFloat(valores.alturaInches) || 0
    const totalInches = feet * 12 + inches
    alturaCm = totalInches * CM_PER_INCH
    pesoKg = (parseFloat(valores.pesoLbs) || 0) / LBS_PER_KG
    temValores = totalInches >= 39 && pesoKg >= 30 && idadeNum >= 1
  }

  let resultado = null
  if (temValores) {
    const imc = calcularIMC(pesoKg, alturaCm)
    const classificacao = classificarIMC(imc, t)
    const pesoMinKg = pesoIdealMin(alturaCm)
    const pesoMaxKg = pesoIdealMax(alturaCm)
    resultado = {
      imc,
      classificacao,
      pesoMinKg,
      pesoMaxKg,
      pesoKg,
      alturaCm,
      idadeNum,
      genero,
      units,
    }
  }

  const onSubmit = () => {
    if (resultado) setCalculatedResult(resultado)
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack align="stretch" spacing={5}>
            <FormControl isInvalid={!!errors.genero}>
              <FormLabel>{t.gender}</FormLabel>
              <Controller
                name="genero"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onChange={field.onChange}>
                    <VStack align="flex-start" spacing={2}>
                      <Radio value="male">{t.male}</Radio>
                      <Radio value="female">{t.female}</Radio>
                    </VStack>
                  </RadioGroup>
                )}
              />
              <FormErrorMessage>{errors.genero?.message}</FormErrorMessage>
            </FormControl>

            {units === 'metric' ? (
              <>
                <FormControl isInvalid={!!errors.altura}>
                  <FormLabel>{t.height}</FormLabel>
                  <Input
                    type="number"
                    placeholder={t.placeholderHeight}
                    {...register('altura')}
                    min={100}
                    max={250}
                  />
                  <FormErrorMessage>{errors.altura?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.peso}>
                  <FormLabel>{t.weight}</FormLabel>
                  <Input
                    type="number"
                    placeholder={t.placeholderWeight}
                    step={0.1}
                    {...register('peso')}
                    min={30}
                    max={300}
                  />
                  <FormErrorMessage>{errors.peso?.message}</FormErrorMessage>
                </FormControl>
              </>
            ) : (
              <>
                <FormControl isInvalid={!!errors.alturaFeet || !!errors.alturaInches}>
                  <FormLabel>{t.heightFt} + {t.heightIn}</FormLabel>
                  <HStack spacing={2}>
                    <Input
                      type="number"
                      placeholder={t.placeholderHeightFt}
                      {...register('alturaFeet')}
                      min={3}
                      max={8}
                    />
                    <Input
                      type="number"
                      placeholder={t.placeholderHeightIn}
                      {...register('alturaInches')}
                      min={0}
                      max={11}
                    />
                  </HStack>
                  <FormErrorMessage>
                    {errors.alturaFeet?.message || errors.alturaInches?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.pesoLbs}>
                  <FormLabel>{t.weightLbs}</FormLabel>
                  <Input
                    type="number"
                    placeholder={t.placeholderWeightLbs}
                    step={0.1}
                    {...register('pesoLbs')}
                    min={66}
                    max={660}
                  />
                  <FormErrorMessage>{errors.pesoLbs?.message}</FormErrorMessage>
                </FormControl>
              </>
            )}

            <FormControl isInvalid={!!errors.idade}>
              <FormLabel>{t.age}</FormLabel>
              <Input
                type="number"
                placeholder={t.placeholderAge}
                {...register('idade')}
                min={1}
                max={120}
              />
              <FormErrorMessage>{errors.idade?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="green" size="lg" width="full">
              {t.calculate}
            </Button>
          </VStack>
        </form>

        {calculatedResult && (
          <Box mt={6} pt={6} borderTopWidth="1px" borderColor={borderColor}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={`${calculatedResult.classificacao.color}.500`}
            >
              {calculatedResult.imc.toFixed(1)}
            </Text>
            <Text fontWeight="semibold" fontSize="lg" mt={1}>
              {calculatedResult.classificacao.label}
            </Text>
            <SilhuetaResultado
              classificacao={calculatedResult.classificacao}
              genero={genero}
              scaleLabel={t.scalePercent}
            />
            <Text color={mutedColor} fontSize="sm" mt={2}>
              {calculatedResult.units === 'metric'
                ? t.idealRange + ': ' + t.idealRangeBetween(calculatedResult.pesoMinKg, calculatedResult.pesoMaxKg)
                : t.idealRange + ': ' + t.idealRangeBetweenLbs(
                    calculatedResult.pesoMinKg * LBS_PER_KG,
                    calculatedResult.pesoMaxKg * LBS_PER_KG
                  )}
            </Text>

            <Button
              mt={4}
              variant="outline"
              colorScheme="blue"
              width="full"
              onClick={() =>
                navigate('/metabolismo', {
                  state: {
                    pesoKg: calculatedResult.pesoKg,
                    alturaCm: calculatedResult.alturaCm,
                    idadeNum: calculatedResult.idadeNum,
                    genero: calculatedResult.genero,
                    units: calculatedResult.units,
                  },
                })
              }
            >
              {t.viewMetabolism}
            </Button>

            {calculatedResult.imc < 18.5 && (
              <Box
                mt={4}
                p={4}
                borderRadius="md"
                bg={gainBg}
                borderWidth="1px"
                borderColor={gainBorder}
              >
                <Text color={gainText} fontWeight="medium">
                  {calculatedResult.units === 'metric'
                    ? t.gainRecommendation(
                        (calculatedResult.pesoMinKg - calculatedResult.pesoKg).toFixed(1)
                      )
                    : t.gainRecommendationLbs(
                        ((calculatedResult.pesoMinKg - calculatedResult.pesoKg) * LBS_PER_KG).toFixed(0)
                      )}
                </Text>
              </Box>
            )}

            {calculatedResult.imc >= 25 && (
              <Box
                mt={4}
                p={4}
                borderRadius="md"
                bg={loseBg}
                borderWidth="1px"
                borderColor={loseBorder}
              >
                <Text color={loseText} fontWeight="medium">
                  {calculatedResult.units === 'metric'
                    ? t.loseRecommendation(
                        (calculatedResult.pesoKg - calculatedResult.pesoMaxKg).toFixed(1)
                      )
                    : t.loseRecommendationLbs(
                        ((calculatedResult.pesoKg - calculatedResult.pesoMaxKg) * LBS_PER_KG).toFixed(0)
                      )}
                </Text>
              </Box>
            )}

            {calculatedResult.imc >= 18.5 && calculatedResult.imc < 25 && (
              <Text mt={4} color="green.500" fontWeight="medium">
                {t.healthy}
              </Text>
            )}
          </Box>
        )}
      </CardBody>
    </Card>
  )
}
