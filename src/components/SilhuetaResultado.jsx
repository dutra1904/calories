import { Box, Text } from '@chakra-ui/react'
import manImg from '../assets/man.png'
import womenImg from '../assets/women.png'

const STATUS_TO_INDEX = {
  abaixo: 0,
  normal: 1,
  sobrepeso: 2,
  obeso1: 3,
  obeso2: 4,
  obeso3: 5,
}

const COLOR_MAP = {
  yellow: { light: 'rgba(234, 179, 8, 0.5)', solid: '#eab308' },
  green: { light: 'rgba(34, 197, 94, 0.5)', solid: '#22c55e' },
  orange: { light: 'rgba(249, 115, 22, 0.5)', solid: '#f97316' },
  red: { light: 'rgba(239, 68, 68, 0.5)', solid: '#ef4444' },
}

export function SilhuetaResultado({ classificacao, genero, scaleLabel }) {
  const index = STATUS_TO_INDEX[classificacao.status] ?? 0
  const colorInfo = COLOR_MAP[classificacao.color] ?? COLOR_MAP.green
  const imgSrc = genero === 'male' ? manImg : womenImg

  const leftPercent = (index / 6) * 100
  const widthPercent = 100 / 6
  const percentNaEscala = Math.round(((index + 0.5) / 6) * 100)

  return (
    <Box position="relative" w="100%" maxW="320px" mx="auto" mt={4}>
      <Box position="relative" overflow="hidden" borderRadius="lg">
        <img
          src={imgSrc}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
          }}
        />
        <Box
          position="absolute"
          top={0}
          left={`${leftPercent}%`}
          w={`${widthPercent}%`}
          h="100%"
          boxShadow={`0 0 0 3px ${colorInfo.solid}, 0 0 30px 8px ${colorInfo.light}`}
          borderRadius="md"
          pointerEvents="none"
          transition="all 0.3s ease"
        />
        <Box
          position="absolute"
          top={0}
          left={`${leftPercent}%`}
          w={`${widthPercent}%`}
          h="100%"
          bg={colorInfo.solid}
          opacity={0.2}
          borderRadius="md"
          pointerEvents="none"
          transition="all 0.3s ease"
        />
      </Box>
      <Text
        fontSize="xs"
        color={colorInfo.solid}
        fontWeight="medium"
        textAlign="center"
        mt={2}
      >
        {scaleLabel ? scaleLabel(percentNaEscala) : `${percentNaEscala}% da escala IMC`}
      </Text>
    </Box>
  )
}
