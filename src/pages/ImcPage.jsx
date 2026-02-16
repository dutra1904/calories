import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useLocale } from '../context/LocaleContext'
import { Header } from '../components/Header'
import { ImcForm } from '../components/ImcForm'
import { TabelaReferencia } from '../components/TabelaReferencia'
import { translations } from '../i18n/translations'

export function ImcPage() {
  const { locale } = useLocale()
  const t = translations[locale]

  return (
    <Box pt={14}>
      <Container maxW="lg" py={10}>
        <VStack align="stretch" spacing={8}>
          <VStack align="center" spacing={1}>
            <Heading size="xl" color="green.600">
              {t.title}
            </Heading>
            <Text color="gray.500">
              {t.subtitle}
            </Text>
          </VStack>

          <ImcForm />
          <TabelaReferencia />
        </VStack>
      </Container>
    </Box>
  )
}
