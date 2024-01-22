        ;; stacker DB
        (define-read-only (stackerdb-get-signer-slots)
            (ok (list
                {
                    signer: 'ST3ZEDTF84FBDTNNC060SRAWGXKQSWVM3BCRYZR9M,
                    num-slots: u10
                }
                )))

        (define-read-only (stackerdb-get-config)
            (ok {
                chunk-size: u4096,
                write-freq: u0,
                max-writes: u4096,
                max-neighbors: u32,
                hint-replicas: (list )
            }))
    