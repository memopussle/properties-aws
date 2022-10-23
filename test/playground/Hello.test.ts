import { handler } from '../../services/PropertyTable/Read'

const event = {
    body: {
      address: "1 Avenue Auckland"
    }
} // passing event as argument in handler function



const result = handler({} as any, {} as any).then((apiResult) => {
  const item = JSON.parse(apiResult.body)
  console.log(123);
})