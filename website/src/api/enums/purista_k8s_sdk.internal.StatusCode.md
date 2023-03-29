[PURISTA API - v1.4.9](../README.md) / [Modules](../modules.md) / [@purista/k8s-sdk](../modules/purista_k8s_sdk.md) / [internal](../modules/purista_k8s_sdk.internal.md) / StatusCode

# Enumeration: StatusCode

[@purista/k8s-sdk](../modules/purista_k8s_sdk.md).[internal](../modules/purista_k8s_sdk.internal.md).StatusCode

Message and error status codes.
The codes are based on HTTP status codes

## Table of contents

### Enumeration Members

- [Accepted](purista_k8s_sdk.internal.StatusCode.md#accepted)
- [AlreadyReported](purista_k8s_sdk.internal.StatusCode.md#alreadyreported)
- [BadGateway](purista_k8s_sdk.internal.StatusCode.md#badgateway)
- [BadRequest](purista_k8s_sdk.internal.StatusCode.md#badrequest)
- [BandwidthLimitExceeded](purista_k8s_sdk.internal.StatusCode.md#bandwidthlimitexceeded)
- [Conflict](purista_k8s_sdk.internal.StatusCode.md#conflict)
- [Created](purista_k8s_sdk.internal.StatusCode.md#created)
- [ExpectationFailed](purista_k8s_sdk.internal.StatusCode.md#expectationfailed)
- [Forbidden](purista_k8s_sdk.internal.StatusCode.md#forbidden)
- [GatewayTimeout](purista_k8s_sdk.internal.StatusCode.md#gatewaytimeout)
- [Gone](purista_k8s_sdk.internal.StatusCode.md#gone)
- [HTTPVersionNotSupported](purista_k8s_sdk.internal.StatusCode.md#httpversionnotsupported)
- [IMUsed](purista_k8s_sdk.internal.StatusCode.md#imused)
- [ImATeapot](purista_k8s_sdk.internal.StatusCode.md#imateapot)
- [InfoContinue](purista_k8s_sdk.internal.StatusCode.md#infocontinue)
- [InfoProcessing](purista_k8s_sdk.internal.StatusCode.md#infoprocessing)
- [InfoSwitchingProtocols](purista_k8s_sdk.internal.StatusCode.md#infoswitchingprotocols)
- [InsufficientStorage](purista_k8s_sdk.internal.StatusCode.md#insufficientstorage)
- [InternalServerError](purista_k8s_sdk.internal.StatusCode.md#internalservererror)
- [InvalidToken](purista_k8s_sdk.internal.StatusCode.md#invalidtoken)
- [LengthRequired](purista_k8s_sdk.internal.StatusCode.md#lengthrequired)
- [Locked](purista_k8s_sdk.internal.StatusCode.md#locked)
- [LoginTimeOut](purista_k8s_sdk.internal.StatusCode.md#logintimeout)
- [LoopDetected](purista_k8s_sdk.internal.StatusCode.md#loopdetected)
- [MethodNotAllowed](purista_k8s_sdk.internal.StatusCode.md#methodnotallowed)
- [MisdirectedRequest](purista_k8s_sdk.internal.StatusCode.md#misdirectedrequest)
- [MultiStatus](purista_k8s_sdk.internal.StatusCode.md#multistatus)
- [NetworkAuthRequired](purista_k8s_sdk.internal.StatusCode.md#networkauthrequired)
- [NoContent](purista_k8s_sdk.internal.StatusCode.md#nocontent)
- [NonAuthoritativeInfo](purista_k8s_sdk.internal.StatusCode.md#nonauthoritativeinfo)
- [NotAcceptable](purista_k8s_sdk.internal.StatusCode.md#notacceptable)
- [NotExtended](purista_k8s_sdk.internal.StatusCode.md#notextended)
- [NotFound](purista_k8s_sdk.internal.StatusCode.md#notfound)
- [NotImplemented](purista_k8s_sdk.internal.StatusCode.md#notimplemented)
- [OK](purista_k8s_sdk.internal.StatusCode.md#ok)
- [PartialContent](purista_k8s_sdk.internal.StatusCode.md#partialcontent)
- [PayloadTooLarge](purista_k8s_sdk.internal.StatusCode.md#payloadtoolarge)
- [PaymentRequired](purista_k8s_sdk.internal.StatusCode.md#paymentrequired)
- [PreconditionFailed](purista_k8s_sdk.internal.StatusCode.md#preconditionfailed)
- [PreconditionRequired](purista_k8s_sdk.internal.StatusCode.md#preconditionrequired)
- [ProxyAuthRequired](purista_k8s_sdk.internal.StatusCode.md#proxyauthrequired)
- [RangeNotSatisfiable](purista_k8s_sdk.internal.StatusCode.md#rangenotsatisfiable)
- [RedirectFound](purista_k8s_sdk.internal.StatusCode.md#redirectfound)
- [RedirectMovedPermanently](purista_k8s_sdk.internal.StatusCode.md#redirectmovedpermanently)
- [RedirectMultipleChoices](purista_k8s_sdk.internal.StatusCode.md#redirectmultiplechoices)
- [RedirectNotModified](purista_k8s_sdk.internal.StatusCode.md#redirectnotmodified)
- [RedirectPermanent](purista_k8s_sdk.internal.StatusCode.md#redirectpermanent)
- [RedirectSeeOther](purista_k8s_sdk.internal.StatusCode.md#redirectseeother)
- [RedirectSwitchProxy](purista_k8s_sdk.internal.StatusCode.md#redirectswitchproxy)
- [RedirectTemp](purista_k8s_sdk.internal.StatusCode.md#redirecttemp)
- [RedirectUseProxy](purista_k8s_sdk.internal.StatusCode.md#redirectuseproxy)
- [RequestHeaderFieldsTooLarge](purista_k8s_sdk.internal.StatusCode.md#requestheaderfieldstoolarge)
- [RequestTimeout](purista_k8s_sdk.internal.StatusCode.md#requesttimeout)
- [ResetContent](purista_k8s_sdk.internal.StatusCode.md#resetcontent)
- [RetryWith](purista_k8s_sdk.internal.StatusCode.md#retrywith)
- [ServiceUnavailable](purista_k8s_sdk.internal.StatusCode.md#serviceunavailable)
- [TokenRequired](purista_k8s_sdk.internal.StatusCode.md#tokenrequired)
- [TooManyRequests](purista_k8s_sdk.internal.StatusCode.md#toomanyrequests)
- [URITooLong](purista_k8s_sdk.internal.StatusCode.md#uritoolong)
- [Unauthorized](purista_k8s_sdk.internal.StatusCode.md#unauthorized)
- [UnavailableForLegalReasons](purista_k8s_sdk.internal.StatusCode.md#unavailableforlegalreasons)
- [UnprocessableEntity](purista_k8s_sdk.internal.StatusCode.md#unprocessableentity)
- [UnsupportedMediaType](purista_k8s_sdk.internal.StatusCode.md#unsupportedmediatype)
- [UpgradeRequired](purista_k8s_sdk.internal.StatusCode.md#upgraderequired)
- [VariantAlsoNegotiates](purista_k8s_sdk.internal.StatusCode.md#variantalsonegotiates)

## Enumeration Members

### Accepted

• **Accepted** = ``202``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:11

___

### AlreadyReported

• **AlreadyReported** = ``208``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:17

___

### BadGateway

• **BadGateway** = ``502``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:61

___

### BadRequest

• **BadRequest** = ``400``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:28

___

### BandwidthLimitExceeded

• **BandwidthLimitExceeded** = ``509``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:68

___

### Conflict

• **Conflict** = ``409``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:37

___

### Created

• **Created** = ``201``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:10

___

### ExpectationFailed

• **ExpectationFailed** = ``417``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:45

___

### Forbidden

• **Forbidden** = ``403``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:31

___

### GatewayTimeout

• **GatewayTimeout** = ``504``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:63

___

### Gone

• **Gone** = ``410``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:38

___

### HTTPVersionNotSupported

• **HTTPVersionNotSupported** = ``505``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:64

___

### IMUsed

• **IMUsed** = ``229``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:18

___

### ImATeapot

• **ImATeapot** = ``418``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:46

___

### InfoContinue

• **InfoContinue** = ``100``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:6

___

### InfoProcessing

• **InfoProcessing** = ``102``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:8

___

### InfoSwitchingProtocols

• **InfoSwitchingProtocols** = ``101``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:7

___

### InsufficientStorage

• **InsufficientStorage** = ``507``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:66

___

### InternalServerError

• **InternalServerError** = ``500``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:59

___

### InvalidToken

• **InvalidToken** = ``498``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:57

___

### LengthRequired

• **LengthRequired** = ``411``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:39

___

### Locked

• **Locked** = ``423``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:49

___

### LoginTimeOut

• **LoginTimeOut** = ``440``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:54

___

### LoopDetected

• **LoopDetected** = ``508``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:67

___

### MethodNotAllowed

• **MethodNotAllowed** = ``405``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:33

___

### MisdirectedRequest

• **MisdirectedRequest** = ``421``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:47

___

### MultiStatus

• **MultiStatus** = ``207``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:16

___

### NetworkAuthRequired

• **NetworkAuthRequired** = ``511``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:70

___

### NoContent

• **NoContent** = ``204``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:13

___

### NonAuthoritativeInfo

• **NonAuthoritativeInfo** = ``203``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:12

___

### NotAcceptable

• **NotAcceptable** = ``406``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:34

___

### NotExtended

• **NotExtended** = ``510``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:69

___

### NotFound

• **NotFound** = ``404``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:32

___

### NotImplemented

• **NotImplemented** = ``501``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:60

___

### OK

• **OK** = ``200``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:9

___

### PartialContent

• **PartialContent** = ``206``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:15

___

### PayloadTooLarge

• **PayloadTooLarge** = ``413``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:41

___

### PaymentRequired

• **PaymentRequired** = ``402``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:30

___

### PreconditionFailed

• **PreconditionFailed** = ``412``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:40

___

### PreconditionRequired

• **PreconditionRequired** = ``428``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:51

___

### ProxyAuthRequired

• **ProxyAuthRequired** = ``407``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:35

___

### RangeNotSatisfiable

• **RangeNotSatisfiable** = ``416``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:44

___

### RedirectFound

• **RedirectFound** = ``302``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:21

___

### RedirectMovedPermanently

• **RedirectMovedPermanently** = ``301``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:20

___

### RedirectMultipleChoices

• **RedirectMultipleChoices** = ``300``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:19

___

### RedirectNotModified

• **RedirectNotModified** = ``304``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:23

___

### RedirectPermanent

• **RedirectPermanent** = ``308``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:27

___

### RedirectSeeOther

• **RedirectSeeOther** = ``303``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:22

___

### RedirectSwitchProxy

• **RedirectSwitchProxy** = ``306``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:25

___

### RedirectTemp

• **RedirectTemp** = ``307``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:26

___

### RedirectUseProxy

• **RedirectUseProxy** = ``305``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:24

___

### RequestHeaderFieldsTooLarge

• **RequestHeaderFieldsTooLarge** = ``431``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:53

___

### RequestTimeout

• **RequestTimeout** = ``408``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:36

___

### ResetContent

• **ResetContent** = ``205``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:14

___

### RetryWith

• **RetryWith** = ``449``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:55

___

### ServiceUnavailable

• **ServiceUnavailable** = ``503``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:62

___

### TokenRequired

• **TokenRequired** = ``499``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:58

___

### TooManyRequests

• **TooManyRequests** = ``429``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:52

___

### URITooLong

• **URITooLong** = ``414``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:42

___

### Unauthorized

• **Unauthorized** = ``401``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:29

___

### UnavailableForLegalReasons

• **UnavailableForLegalReasons** = ``451``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:56

___

### UnprocessableEntity

• **UnprocessableEntity** = ``422``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:48

___

### UnsupportedMediaType

• **UnsupportedMediaType** = ``415``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:43

___

### UpgradeRequired

• **UpgradeRequired** = ``426``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:50

___

### VariantAlsoNegotiates

• **VariantAlsoNegotiates** = ``506``

#### Defined in

packages/core/lib/core/types/StatusCode.enum.d.ts:65
