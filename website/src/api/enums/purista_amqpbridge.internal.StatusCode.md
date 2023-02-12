[PURISTA API - v1.4.9](../README.md) / [@purista/amqpbridge](../modules/purista_amqpbridge.md) / [internal](../modules/purista_amqpbridge.internal.md) / StatusCode

# Enumeration: StatusCode

[@purista/amqpbridge](../modules/purista_amqpbridge.md).[internal](../modules/purista_amqpbridge.internal.md).StatusCode

## Table of contents

### Enumeration Members

- [Accepted](purista_amqpbridge.internal.StatusCode.md#accepted)
- [AlreadyReported](purista_amqpbridge.internal.StatusCode.md#alreadyreported)
- [BadGateway](purista_amqpbridge.internal.StatusCode.md#badgateway)
- [BadRequest](purista_amqpbridge.internal.StatusCode.md#badrequest)
- [BandwidthLimitExceeded](purista_amqpbridge.internal.StatusCode.md#bandwidthlimitexceeded)
- [Conflict](purista_amqpbridge.internal.StatusCode.md#conflict)
- [Created](purista_amqpbridge.internal.StatusCode.md#created)
- [ExpectationFailed](purista_amqpbridge.internal.StatusCode.md#expectationfailed)
- [Forbidden](purista_amqpbridge.internal.StatusCode.md#forbidden)
- [GatewayTimeout](purista_amqpbridge.internal.StatusCode.md#gatewaytimeout)
- [Gone](purista_amqpbridge.internal.StatusCode.md#gone)
- [HTTPVersionNotSupported](purista_amqpbridge.internal.StatusCode.md#httpversionnotsupported)
- [IMUsed](purista_amqpbridge.internal.StatusCode.md#imused)
- [ImATeapot](purista_amqpbridge.internal.StatusCode.md#imateapot)
- [InfoContinue](purista_amqpbridge.internal.StatusCode.md#infocontinue)
- [InfoProcessing](purista_amqpbridge.internal.StatusCode.md#infoprocessing)
- [InfoSwitchingProtocols](purista_amqpbridge.internal.StatusCode.md#infoswitchingprotocols)
- [InsufficientStorage](purista_amqpbridge.internal.StatusCode.md#insufficientstorage)
- [InternalServerError](purista_amqpbridge.internal.StatusCode.md#internalservererror)
- [InvalidToken](purista_amqpbridge.internal.StatusCode.md#invalidtoken)
- [LengthRequired](purista_amqpbridge.internal.StatusCode.md#lengthrequired)
- [Locked](purista_amqpbridge.internal.StatusCode.md#locked)
- [LoginTimeOut](purista_amqpbridge.internal.StatusCode.md#logintimeout)
- [LoopDetected](purista_amqpbridge.internal.StatusCode.md#loopdetected)
- [MethodNotAllowed](purista_amqpbridge.internal.StatusCode.md#methodnotallowed)
- [MisdirectedRequest](purista_amqpbridge.internal.StatusCode.md#misdirectedrequest)
- [MultiStatus](purista_amqpbridge.internal.StatusCode.md#multistatus)
- [NetworkAuthRequired](purista_amqpbridge.internal.StatusCode.md#networkauthrequired)
- [NoContent](purista_amqpbridge.internal.StatusCode.md#nocontent)
- [NonAuthoritativeInfo](purista_amqpbridge.internal.StatusCode.md#nonauthoritativeinfo)
- [NotAcceptable](purista_amqpbridge.internal.StatusCode.md#notacceptable)
- [NotExtended](purista_amqpbridge.internal.StatusCode.md#notextended)
- [NotFound](purista_amqpbridge.internal.StatusCode.md#notfound)
- [NotImplemented](purista_amqpbridge.internal.StatusCode.md#notimplemented)
- [OK](purista_amqpbridge.internal.StatusCode.md#ok)
- [PartialContent](purista_amqpbridge.internal.StatusCode.md#partialcontent)
- [PayloadTooLarge](purista_amqpbridge.internal.StatusCode.md#payloadtoolarge)
- [PaymentRequired](purista_amqpbridge.internal.StatusCode.md#paymentrequired)
- [PreconditionFailed](purista_amqpbridge.internal.StatusCode.md#preconditionfailed)
- [PreconditionRequired](purista_amqpbridge.internal.StatusCode.md#preconditionrequired)
- [ProxyAuthRequired](purista_amqpbridge.internal.StatusCode.md#proxyauthrequired)
- [RangeNotSatisfiable](purista_amqpbridge.internal.StatusCode.md#rangenotsatisfiable)
- [RedirectFound](purista_amqpbridge.internal.StatusCode.md#redirectfound)
- [RedirectMovedPermanently](purista_amqpbridge.internal.StatusCode.md#redirectmovedpermanently)
- [RedirectMultipleChoices](purista_amqpbridge.internal.StatusCode.md#redirectmultiplechoices)
- [RedirectNotModified](purista_amqpbridge.internal.StatusCode.md#redirectnotmodified)
- [RedirectPermanent](purista_amqpbridge.internal.StatusCode.md#redirectpermanent)
- [RedirectSeeOther](purista_amqpbridge.internal.StatusCode.md#redirectseeother)
- [RedirectSwitchProxy](purista_amqpbridge.internal.StatusCode.md#redirectswitchproxy)
- [RedirectTemp](purista_amqpbridge.internal.StatusCode.md#redirecttemp)
- [RedirectUseProxy](purista_amqpbridge.internal.StatusCode.md#redirectuseproxy)
- [RequestHeaderFieldsTooLarge](purista_amqpbridge.internal.StatusCode.md#requestheaderfieldstoolarge)
- [RequestTimeout](purista_amqpbridge.internal.StatusCode.md#requesttimeout)
- [ResetContent](purista_amqpbridge.internal.StatusCode.md#resetcontent)
- [RetryWith](purista_amqpbridge.internal.StatusCode.md#retrywith)
- [ServiceUnavailable](purista_amqpbridge.internal.StatusCode.md#serviceunavailable)
- [TokenRequired](purista_amqpbridge.internal.StatusCode.md#tokenrequired)
- [TooManyRequests](purista_amqpbridge.internal.StatusCode.md#toomanyrequests)
- [URITooLong](purista_amqpbridge.internal.StatusCode.md#uritoolong)
- [Unauthorized](purista_amqpbridge.internal.StatusCode.md#unauthorized)
- [UnavailableForLegalReasons](purista_amqpbridge.internal.StatusCode.md#unavailableforlegalreasons)
- [UnprocessableEntity](purista_amqpbridge.internal.StatusCode.md#unprocessableentity)
- [UnsupportedMediaType](purista_amqpbridge.internal.StatusCode.md#unsupportedmediatype)
- [UpgradeRequired](purista_amqpbridge.internal.StatusCode.md#upgraderequired)
- [VariantAlsoNegotiates](purista_amqpbridge.internal.StatusCode.md#variantalsonegotiates)

## Enumeration Members

### Accepted

• **Accepted** = ``202``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:7

___

### AlreadyReported

• **AlreadyReported** = ``208``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:13

___

### BadGateway

• **BadGateway** = ``502``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:57

___

### BadRequest

• **BadRequest** = ``400``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:24

___

### BandwidthLimitExceeded

• **BandwidthLimitExceeded** = ``509``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:64

___

### Conflict

• **Conflict** = ``409``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:33

___

### Created

• **Created** = ``201``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:6

___

### ExpectationFailed

• **ExpectationFailed** = ``417``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:41

___

### Forbidden

• **Forbidden** = ``403``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:27

___

### GatewayTimeout

• **GatewayTimeout** = ``504``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:59

___

### Gone

• **Gone** = ``410``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:34

___

### HTTPVersionNotSupported

• **HTTPVersionNotSupported** = ``505``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:60

___

### IMUsed

• **IMUsed** = ``229``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:14

___

### ImATeapot

• **ImATeapot** = ``418``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:42

___

### InfoContinue

• **InfoContinue** = ``100``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:2

___

### InfoProcessing

• **InfoProcessing** = ``102``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:4

___

### InfoSwitchingProtocols

• **InfoSwitchingProtocols** = ``101``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:3

___

### InsufficientStorage

• **InsufficientStorage** = ``507``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:62

___

### InternalServerError

• **InternalServerError** = ``500``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:55

___

### InvalidToken

• **InvalidToken** = ``498``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:53

___

### LengthRequired

• **LengthRequired** = ``411``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:35

___

### Locked

• **Locked** = ``423``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:45

___

### LoginTimeOut

• **LoginTimeOut** = ``440``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:50

___

### LoopDetected

• **LoopDetected** = ``508``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:63

___

### MethodNotAllowed

• **MethodNotAllowed** = ``405``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:29

___

### MisdirectedRequest

• **MisdirectedRequest** = ``421``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:43

___

### MultiStatus

• **MultiStatus** = ``207``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:12

___

### NetworkAuthRequired

• **NetworkAuthRequired** = ``511``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:66

___

### NoContent

• **NoContent** = ``204``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:9

___

### NonAuthoritativeInfo

• **NonAuthoritativeInfo** = ``203``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:8

___

### NotAcceptable

• **NotAcceptable** = ``406``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:30

___

### NotExtended

• **NotExtended** = ``510``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:65

___

### NotFound

• **NotFound** = ``404``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:28

___

### NotImplemented

• **NotImplemented** = ``501``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:56

___

### OK

• **OK** = ``200``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:5

___

### PartialContent

• **PartialContent** = ``206``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:11

___

### PayloadTooLarge

• **PayloadTooLarge** = ``413``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:37

___

### PaymentRequired

• **PaymentRequired** = ``402``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:26

___

### PreconditionFailed

• **PreconditionFailed** = ``412``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:36

___

### PreconditionRequired

• **PreconditionRequired** = ``428``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:47

___

### ProxyAuthRequired

• **ProxyAuthRequired** = ``407``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:31

___

### RangeNotSatisfiable

• **RangeNotSatisfiable** = ``416``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:40

___

### RedirectFound

• **RedirectFound** = ``302``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:17

___

### RedirectMovedPermanently

• **RedirectMovedPermanently** = ``301``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:16

___

### RedirectMultipleChoices

• **RedirectMultipleChoices** = ``300``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:15

___

### RedirectNotModified

• **RedirectNotModified** = ``304``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:19

___

### RedirectPermanent

• **RedirectPermanent** = ``308``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:23

___

### RedirectSeeOther

• **RedirectSeeOther** = ``303``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:18

___

### RedirectSwitchProxy

• **RedirectSwitchProxy** = ``306``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:21

___

### RedirectTemp

• **RedirectTemp** = ``307``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:22

___

### RedirectUseProxy

• **RedirectUseProxy** = ``305``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:20

___

### RequestHeaderFieldsTooLarge

• **RequestHeaderFieldsTooLarge** = ``431``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:49

___

### RequestTimeout

• **RequestTimeout** = ``408``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:32

___

### ResetContent

• **ResetContent** = ``205``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:10

___

### RetryWith

• **RetryWith** = ``449``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:51

___

### ServiceUnavailable

• **ServiceUnavailable** = ``503``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:58

___

### TokenRequired

• **TokenRequired** = ``499``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:54

___

### TooManyRequests

• **TooManyRequests** = ``429``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:48

___

### URITooLong

• **URITooLong** = ``414``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:38

___

### Unauthorized

• **Unauthorized** = ``401``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:25

___

### UnavailableForLegalReasons

• **UnavailableForLegalReasons** = ``451``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:52

___

### UnprocessableEntity

• **UnprocessableEntity** = ``422``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:44

___

### UnsupportedMediaType

• **UnsupportedMediaType** = ``415``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:39

___

### UpgradeRequired

• **UpgradeRequired** = ``426``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:46

___

### VariantAlsoNegotiates

• **VariantAlsoNegotiates** = ``506``

#### Defined in

core/lib/core/types/StatusCode.enum.d.ts:61
