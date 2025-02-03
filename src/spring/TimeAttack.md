maven download, correct dependency
setup properties, add meta
setup spring doc, config spring doc


```java

import io.swagger.v3.oas.models.Operation;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerMethod;
import io.swagger.v3.oas.annotations.tags.Tag;

@Configuration
public class SpringDocConfig {
    @Bean
    public OperationCustomizer operationIdCustomizer() {
        OperationCustomizer c = new OperationCustomizer() {
            @Override
            public Operation customize(Operation operation, HandlerMethod handlerMethod) {
                Tag tag = handlerMethod.getBeanType().getAnnotation(Tag.class);
                if (tag != null && tag.name() != null) {
                    operation.setOperationId(String.format("%s_%s", tag.name(), handlerMethod.getMethod().getName()));
                } else {
                    operation.setOperationId(handlerMethod.getMethod().getName());
                }
                return operation;
            }
        };
        return c;
    }

}
```