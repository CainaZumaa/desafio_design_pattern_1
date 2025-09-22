# Crypto Monitor

Aplicativo de console para monitoramento de preços de criptomoedas em tempo real com sistema de alertas configurável.

## Desafio

Você foi contratado para criar um aplicativo de console que monitore o preço de uma criptomoeda em tempo real.
O programa deve solicitar ao usuário o nome da moeda (ex.: bitcoin, ethereum, solana) e mostrar seu preço atual em dólares.

O sistema também deve permitir configurar estratégias de alerta:

- **ThresholdStrategy**: dispara alerta se o preço ultrapassar valores definidos de compra/venda.
- **VariationStrategy**: dispara alerta se a moeda variar mais de X% em Y minutos.

### Requisitos:

- O aplicativo deve rodar em loop até o usuário digitar sair.
- A configuração (moeda padrão, valores de compra/venda, percentual de variação) deve ser lida apenas uma vez de um arquivo config.json.
- A lógica de alerta deve ser flexível
- Você pode usar qualquer API pública de criptomoedas.

## Funcionalidades

- Monitoramento de preços em tempo real
- Sistema de alertas flexível com duas estratégias:
  - **ThresholdStrategy**: Alertas baseados em valores de compra/venda
  - **VariationStrategy**: Alertas baseados em variação percentual em tempo determinado
- Configuração via arquivo JSON
- Interface de console interativa

## Padrões de Design Implementados

### 1. Strategy ♟️

- **Interface**: `AlertStrategy`
- **Implementações**: `ThresholdStrategy`, `VariationStrategy`
- **Motivo**: Permitir diferentes algoritmos de alerta serem intercambiáveis em tempo de execução

### 2. Factory Method 🏭

- **Classe**: `AlertStrategyFactory`
- **Motivo**: Centralizar a criação das estratégias de alerta baseadas na configuração

### 3. Singleton 🌐

- **Classes**: `CryptoApiService`, `ConfigService`
- **Motivo**: Garantir uma única instância do serviço de API (economia de recursos) e do serviço de configuração

## Instalação

```bash
npm install
```

## Configuração

Edite o arquivo `config.json`:

```json
{
  "defaultCurrency": "bitcoin",
  "apiKey": "sua-api-key-aqui",
  "alertStrategies": {
    "threshold": {
      "buyThreshold": 0,
      "sellThreshold": 130000
    },
    "variation": {
      "percentageThreshold": 5,
      "timeWindowMinutes": 720
    }
  }
}
```

## Execução

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## Uso

1. Execute o aplicativo
2. Digite o símbolo da criptomoeda (ex: bitcoin, ethereum, solana)
3. O sistema mostrará o preço atual e verificará alertas
4. Digite "sair" para encerrar

## Estrutura do Projeto

```
src/
├── types/
│   └── Config.ts
├── strategies/
│   ├── AlertStrategy.ts
│   ├── ThresholdStrategy.ts
│   └── VariationStrategy.ts
├── factories/
│   └── AlertStrategyFactory.ts
├── services/
│   ├── CryptoApiService.ts
│   └── ConfigService.ts
├── CryptoMonitor.ts
└── index.ts
```

## Monitoramento de Uso
