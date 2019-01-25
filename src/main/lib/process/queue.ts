import Bottleneck from 'bottleneck'
import { Config } from '@lib/config'

export interface IQueue {
    add (job: any): void
    stop (): void
}

class Queue implements IQueue {
    protected limiter: Bottleneck

    constructor () {
        this.limiter = new Bottleneck({
            maxConcurrent: Config.get('concurrency')
        })

        // Listen for config changes on concurrency to update the limiter
        Config.on('set:concurrency', (value: number) => {
            this.limiter.updateSettings({
                maxConcurrent: value
            })
        })
    }

    public add (job: any): void {
        const wrapped = this.limiter.wrap(job)
        wrapped()
    }

    public stop (): void {
        this.limiter.stop()
    }
}

export const queue = new Queue()
