/// Retry seconds
pub struct RetrySec(u64);

impl RetrySec {
    /// Creates a new RetrySec with an initial value of 1 second
    pub fn new() -> Self {
        Self(1)
    }

    /// Doubles the retry seconds, capping at 60 seconds
    pub fn next(&mut self) -> u64 {
        self.0 = self.0.min(60) * 2;
        self.0
    }

    /// Resets the retry seconds to the initial value of 1 second
    pub fn reset(&mut self) {
        self.0 = 1;
    }
}
