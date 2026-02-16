import {
  Badge,
  Card,
  CardBody,
  Heading,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useLocale } from '../context/LocaleContext'
import { translations } from '../i18n/translations'

const categorias = [
  { id: 'abaixo', colorScheme: 'yellow' },
  { id: 'normal', colorScheme: 'green' },
  { id: 'sobrepeso', colorScheme: 'orange' },
  { id: 'obeso1', colorScheme: 'red' },
  { id: 'obeso2', colorScheme: 'red' },
  { id: 'obeso3', colorScheme: 'red' },
]

export function TabelaReferencia() {
  const { locale } = useLocale()
  const t = translations[locale]
  const mutedColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <Card>
      <CardBody>
        <Heading size="sm" color={mutedColor} textTransform="uppercase" letterSpacing="wider" mb={4}>
          {t.referenceTitle}
        </Heading>
        <List spacing={2}>
          {categorias.map((cat) => (
            <ListItem key={cat.id} display="flex" alignItems="center" gap={2}>
              <Badge colorScheme={cat.colorScheme} minW="120px">
                {t.categories[cat.id].label}
              </Badge>
              <Text color={mutedColor} fontSize="sm">
                — {t.categories[cat.id].faixa}
              </Text>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  )
}
