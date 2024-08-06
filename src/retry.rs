// リトライ秒数
pub struct RetrySec(u64);

impl RetrySec {
    pub fn new() -> Self {
        Self(1)
    }

    pub fn next(&mut self) -> u64 {
        self.0 = self.0.min(60) * 2;
        self.0
    }

    pub fn reset(&mut self) {
        self.0 = 1;
    }
}
