import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { translations } from '../i18n/translations'

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra: 1.9,
}

function calcularTMB(pesoKg, alturaCm, idade, genero) {
  const base = 10 * pesoKg + 6.25 * alturaCm - 5 * idade
  return genero === 'male' ? base + 5 : base - 161
}

export function MetabolismoPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { locale } = useLocale()
  const t = translations[locale]

  const [activity, setActivity] = useState('sedentary')

  const data = location.state
  const tmbBg = useColorModeValue('gray.50', 'gray.700')
  const mutedColor = useColorModeValue('gray.500', 'gray.400')

  const tmb = data ? calcularTMB(data.pesoKg, data.alturaCm, data.idadeNum, data.genero) : null
  const multiplier = ACTIVITY_MULTIPLIERS[activity] ?? 1.2
  const tdee = tmb ? Math.round(tmb * multiplier) : null

  return (
    <Box pt={14}>
      <Container maxW="lg" py={10}>
        <VStack align="stretch" spacing={6}>
          <Button
            alignSelf="flex-start"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            ← {t.backToImc}
          </Button>

          <VStack align="center" spacing={1}>
            <Heading size="xl" color="blue.600">
              {t.metabolismTitle}
            </Heading>
            <Text color={mutedColor}>
              {t.metabolismSubtitle}
            </Text>
          </VStack>

          {data ? (
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  <Box p={4} borderRadius="md" bg={tmbBg}>
                    <Text fontWeight="medium" fontSize="sm" color={mutedColor}>
                      {t.basalMetabolism}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                      {Math.round(tmb)} kcal/dia
                    </Text>
                    <Text fontSize="sm" color={mutedColor} mt={1}>
                      {t.basalMetabolismDesc}
                    </Text>
                  </Box>

                  <FormControl>
                    <FormLabel>{t.activityLevel}</FormLabel>
                    <RadioGroup value={activity} onChange={setActivity}>
                      <VStack align="stretch" spacing={2}>
                        <Radio value="sedentary">{t.activitySedentary}</Radio>
                        <Radio value="light">{t.activityLight}</Radio>
                        <Radio value="moderate">{t.activityModerate}</Radio>
                        <Radio value="active">{t.activityActive}</Radio>
                        <Radio value="extra">{t.activityExtra}</Radio>
                      </VStack>
                    </RadioGroup>
                  </FormControl>

                  <Box p={4} borderRadius="md" bg={tmbBg}>
                    <Text fontWeight="medium" fontSize="sm" color={mutedColor}>
                      {t.totalExpenditure}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                      {tdee} kcal/dia
                    </Text>
                    <Text fontSize="sm" color={mutedColor} mt={1}>
                      {t.totalExpenditureDesc}
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <Text color={mutedColor} textAlign="center" py={4}>
                  {t.metabolismCalculateFirst}
                </Text>
                <Button colorScheme="green" width="full" onClick={() => navigate('/')}>
                  {t.backToImc}
                </Button>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
