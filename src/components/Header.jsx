import { Box, Button, HStack, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { useUnits } from '../context/UnitsContext'
import { translations } from '../i18n/translations'

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { locale, toggleLocale } = useLocale()
  const { units, toggleUnits } = useUnits()
  const location = useLocation()
  const t = translations[locale]
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
      py={3}
      px={4}
      bg={bg}
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      <HStack justify="space-between" flex={1}>
        <HStack gap={2}>
          <Button as={Link} to="/" size="sm" variant={location.pathname === '/' ? 'solid' : 'ghost'} colorScheme="green">
            {t.navBmi}
          </Button>
          <Button as={Link} to="/metabolismo" size="sm" variant={location.pathname === '/metabolismo' ? 'solid' : 'ghost'} colorScheme="blue">
            {t.navMetabolism}
          </Button>
        </HStack>
        <HStack gap={2}>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleUnits}
          aria-label={units === 'metric' ? t.unitsUS : t.unitsMetric}
        >
          {units === 'metric' ? t.unitsUS : t.unitsMetric}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleLocale}
          aria-label={locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
        >
          {locale === 'pt' ? 'EN' : 'PT'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleColorMode}
          aria-label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}
        >
          {colorMode === 'light' ? '🌙' : '☀️'}
        </Button>
        </HStack>
      </HStack>
    </Box>
  )
}
